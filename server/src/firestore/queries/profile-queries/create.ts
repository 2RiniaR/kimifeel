import { DocumentScheme, ProfileDocument, UserDocument, UserDocumentPath } from "firestore/scheme";
import { db } from "firebase";
import { ProfileQueryResult } from "./result";

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
