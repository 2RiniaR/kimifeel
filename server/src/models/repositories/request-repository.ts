import { Request, RequestIdentifier, RequestProps } from "../structures/request";
import { DocumentScheme } from "./documents/document-scheme";
import { RequestDocument } from "./documents/request-document";
import { User } from "../structures/user";
import { firestore } from "firebase-admin";
import { db } from "~/firebase";
import { UserDocument } from "~/models/repositories/documents/user-document";
import { Context } from "~/models/context";

export class RequestRepository {
  public build(context: Context, snapshot: firestore.DocumentSnapshot): Request | null {
    if (!snapshot?.exists) return null;
    const doc = snapshot.data() as RequestDocument;
    return new Request(context, {
      ...RequestRepository.toProps(context, doc),
      ...RequestRepository.toIdentifier(context, snapshot)
    });
  }

  public buildFirst(context: Context, snapshot: firestore.QuerySnapshot): Request | null {
    if (snapshot.empty) return null;
    return this.build(context, snapshot.docs[0]);
  }

  private static getDocumentReference(request: Request) {
    return DocumentScheme.request(request.target.id, request.id);
  }

  private static toIdentifier(context: Context, snapshot: firestore.DocumentSnapshot): RequestIdentifier {
    return {
      id: snapshot.id,
      target: new User(context, { id: snapshot.ref.id })
    };
  }

  private static toProps(context: Context, doc: RequestDocument): RequestProps {
    return {
      content: doc.content,
      requester: new User(context, { id: doc.requesterUserId }),
      index: doc.index
    };
  }

  private static toDocument(props: RequestProps): RequestDocument {
    return {
      content: props.content,
      requesterUserId: props.requester.id,
      index: props.index
    };
  }

  async getById(context: Context, userId: string, requestId: string): Promise<Request | null> {
    const snapshot = await DocumentScheme.request(userId, requestId).get();
    return this.build(context, snapshot);
  }

  public async getByIndex(context: Context, index: number): Promise<Request | null> {
    const snapshot = await DocumentScheme.requests(context.clientUser.id).where("index", "==", index).get();
    return this.buildFirst(context, snapshot);
  }

  async create(context: Context, props: CreateProps): Promise<Request> {
    const id = await db.runTransaction(async (transaction) => {
      const userDocRef = DocumentScheme.user(props.target.id);
      const userSnapshot = await transaction.get(userDocRef);
      if (!userSnapshot?.exists) throw Error();
      const userDoc = userSnapshot.data() as UserDocument;

      const requestDoc = RequestRepository.toDocument({ ...props, index: userDoc.requestIndex });
      const requestDocRef = DocumentScheme.requests(props.target.id).doc();
      transaction.create(requestDocRef, requestDoc);

      const afterUserDoc: UserDocument = { ...userDoc, requestIndex: userDoc.requestIndex + 1 };
      transaction.update(userDocRef, afterUserDoc);

      return requestDocRef.id;
    });

    return new Request(context, { ...props, id });
  }

  async delete(request: Request) {
    await RequestRepository.getDocumentReference(request).delete();
  }
}

type CreateProps = Omit<RequestProps, "index"> & {
  target: User;
};
