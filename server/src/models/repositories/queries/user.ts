import { DocumentScheme, UserDocument, UserDocumentPath } from "~/models/repositories/scheme";
import { MultipleQueryResult, SingleQueryResult } from "~/models/repositories/queries/index";
import { db } from "~/firebase";

export type UserQueryResult = UserDocument & UserDocumentPath;

function buildDocument(snapshot: SingleQueryResult): UserQueryResult | undefined {
  if (!snapshot.exists) return;
  const doc = snapshot.data() as UserDocument;
  const path: UserDocumentPath = { userId: snapshot.id };
  return { ...doc, ...path };
}

function buildFirstDocument(snapshot: MultipleQueryResult): UserQueryResult | undefined {
  if (snapshot.empty) return;
  return buildDocument(snapshot.docs[0]);
}

export async function getUserById(userId: string): Promise<UserQueryResult | undefined> {
  const snapshot = await DocumentScheme.user({ userId }).get();
  return buildDocument(snapshot);
}

export async function getUserByDiscordId(discordId: string): Promise<UserQueryResult | undefined> {
  const snapshot = await DocumentScheme.users().where("discordId", "==", discordId).get();
  return buildFirstDocument(snapshot);
}

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
