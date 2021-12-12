import { DocumentScheme, RequestDocument, UserDocument, UserDocumentPath } from "models/scheme";
import { db } from "firebase";
import { RequestQueryResult } from "./result";

type CreateProps = Omit<RequestDocument, "index"> & UserDocumentPath;

export async function createRequest(props: CreateProps): Promise<RequestQueryResult> {
  const { id, index } = await db.runTransaction(async (transaction) => {
    const userDocRef = DocumentScheme.user({ userId: props.userId });
    const userSnapshot = await transaction.get(userDocRef);
    if (!userSnapshot?.exists) {
      throw Error("The request target user was not found.");
    }
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
