import { db } from "~/firebase";
import {
  DocumentScheme,
  ProfileDocument,
  ProfileDocumentPath,
  UserDocument,
  UserDocumentPath
} from "~/models/repositories/scheme";
import { MultipleQueryResult, SingleQueryResult } from "~/models/repositories/queries/index";

export type ProfileQueryResult = ProfileDocument & ProfileDocumentPath;

function buildDocument(snapshot: SingleQueryResult): ProfileQueryResult | undefined {
  const userId = snapshot.ref.parent?.parent?.id;
  if (!snapshot.exists || !userId) return;
  const doc = snapshot.data() as ProfileDocument;
  const path: ProfileDocumentPath = { userId, profileId: snapshot.id };
  return { ...doc, ...path };
}

function buildFirstDocument(snapshot: MultipleQueryResult): ProfileQueryResult | undefined {
  if (snapshot.empty) return;
  return buildDocument(snapshot.docs[0]);
}

function buildAllDocuments(snapshot: MultipleQueryResult): ProfileQueryResult[] {
  return snapshot.docs.map((doc) => buildDocument(doc)).removeNone();
}

export async function getProfileById(userId: string, profileId: string): Promise<ProfileQueryResult | undefined> {
  const snapshot = await DocumentScheme.profile({ userId, profileId }).get();
  return buildDocument(snapshot);
}

export async function getProfileByIndex(userId: string, index: number): Promise<ProfileQueryResult | undefined> {
  const snapshot = await DocumentScheme.profiles({ userId }).where("index", "==", index).get();
  return buildFirstDocument(snapshot);
}

export async function getAllProfiles(userId: string): Promise<ProfileQueryResult[]> {
  const snapshot = await DocumentScheme.profiles({ userId }).get();
  return buildAllDocuments(snapshot);
}

type CreateProps = Omit<ProfileDocument, "index"> & UserDocumentPath;

export async function createProfile(props: CreateProps): Promise<ProfileQueryResult> {
  const { id, index } = await db.runTransaction(async (transaction) => {
    const userDocRef = DocumentScheme.user({ userId: props.userId });
    const userSnapshot = await transaction.get(userDocRef);
    if (!userSnapshot?.exists) {
      throw Error("The profile target user was not found.");
    }
    const userDoc = userSnapshot.data() as UserDocument;

    const profileDoc = (({ content, index, authorUserId }: ProfileDocument) => ({ content, index, authorUserId }))({
      ...props,
      index: userDoc.profileIndex
    });
    const profileDocRef = DocumentScheme.profiles({ userId: props.userId }).doc();
    transaction.create(profileDocRef, profileDoc);

    const afterUserDoc: UserDocument = { ...userDoc, profileIndex: userDoc.profileIndex + 1 };
    transaction.update(userDocRef, afterUserDoc);

    return { id: profileDocRef.id, index: profileDoc.index };
  });

  return {
    userId: props.userId,
    profileId: id,
    index: index,
    content: props.content,
    authorUserId: props.authorUserId
  };
}

export async function deleteProfile(userId: string, profileId: string) {
  await DocumentScheme.profile({ userId, profileId }).delete();
}
