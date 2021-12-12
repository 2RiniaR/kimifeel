import { DocumentScheme, UserDocument } from "firestore/scheme";
import { db } from "firebase";
import { UserQueryResult } from "./result";

type CreateProps = Omit<UserDocument, "profileIndex" | "requestIndex">;

export async function createUserIfNotExist(props: CreateProps): Promise<UserQueryResult> {
  const doc: UserDocument = {
    discordId: props.discordId,
    profileIndex: 1,
    requestIndex: 1
  };

  const id = await db.runTransaction(async (transaction) => {
    const userRef = DocumentScheme.users().where("discordId", "==", props.discordId);
    const userSnapshot = await transaction.get(userRef);
    if (!userSnapshot.empty) return userSnapshot.docs[0].id;

    const newUserDoc = DocumentScheme.users().doc();
    transaction.create(newUserDoc, doc);
    return newUserDoc.id;
  });

  return {
    discordId: props.discordId,
    profileIndex: 1,
    requestIndex: 1,
    userId: id
  };
}
