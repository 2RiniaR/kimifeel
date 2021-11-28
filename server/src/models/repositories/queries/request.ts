import { db } from "~/firebase";
import {
  DocumentScheme,
  RequestDocument,
  RequestDocumentPath,
  UserDocument,
  UserDocumentPath
} from "~/models/repositories/scheme";
import { MultipleQueryResult, SingleQueryResult } from "~/models/repositories/queries/index";

export type RequestQueryResult = RequestDocument & RequestDocumentPath;

function buildDocument(snapshot: SingleQueryResult): RequestQueryResult | undefined {
  const userId = snapshot.ref.parent?.parent?.id;
  if (!snapshot.exists || !userId) return;
  const doc = snapshot.data() as RequestDocument;
  const path: RequestDocumentPath = { userId, requestId: snapshot.id };
  return { ...doc, ...path };
}

function buildFirstDocument(snapshot: MultipleQueryResult): RequestQueryResult | undefined {
  if (snapshot.empty) return;
  return buildDocument(snapshot.docs[0]);
}

function buildAllDocuments(snapshot: MultipleQueryResult): RequestQueryResult[] {
  return snapshot.docs.map((doc) => buildDocument(doc)).removeNone();
}

export async function getRequestById(userId: string, requestId: string): Promise<RequestQueryResult | undefined> {
  const snapshot = await DocumentScheme.request({ userId, requestId }).get();
  return buildDocument(snapshot);
}

export async function getRequestByIndex(userId: string, index: number): Promise<RequestQueryResult | undefined> {
  const snapshot = await DocumentScheme.requests({ userId }).where("index", "==", index).get();
  return buildFirstDocument(snapshot);
}

export async function getAllRequests(userId: string): Promise<RequestQueryResult[]> {
  const snapshot = await DocumentScheme.requests({ userId }).get();
  return buildAllDocuments(snapshot);
}

type CreateProps = Omit<RequestDocument, "index"> & UserDocumentPath;

export async function createRequest(props: CreateProps): Promise<RequestQueryResult> {
  const { id, index } = await db.runTransaction(async (transaction) => {
    const userDocRef = DocumentScheme.user({ userId: props.userId });
    const userSnapshot = await transaction.get(userDocRef);
    if (!userSnapshot?.exists) throw Error();
    const userDoc = userSnapshot.data() as UserDocument;

    const requestDoc = (({ content, index, requesterUserId }: RequestDocument) => ({
      content,
      index,
      requesterUserId
    }))({
      ...props,
      index: userDoc.requestIndex
    });
    const requestDocRef = DocumentScheme.requests({ userId: props.userId }).doc();
    transaction.create(requestDocRef, requestDoc);

    const afterUserDoc: UserDocument = { ...userDoc, requestIndex: userDoc.requestIndex + 1 };
    transaction.update(userDocRef, afterUserDoc);

    return { id: requestDocRef.id, index: requestDoc.index };
  });

  return {
    userId: props.userId,
    requestId: id,
    index: index,
    content: props.content,
    requesterUserId: props.requesterUserId
  };
}

export async function deleteRequest(userId: string, requestId: string) {
  await DocumentScheme.request({ userId, requestId }).delete();
}
