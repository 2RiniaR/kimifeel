import { Profile, ProfileIdentifier, ProfileProps } from "../structures/profile";
import { DocumentScheme } from "./documents/document-scheme";
import { ProfileDocument } from "./documents/profile-document";
import { User } from "../structures/user";
import { db } from "~/firebase";
import { firestore } from "firebase-admin";
import { UserDocument } from "~/models/repositories/documents/user-document";
import { Context } from "~/models/context";

export class ProfileRepository {
  public build(context: Context, snapshot: firestore.DocumentSnapshot): Profile | null {
    if (!snapshot?.exists) return null;
    const doc = snapshot.data() as ProfileDocument;
    return new Profile(context, {
      ...ProfileRepository.toProps(context, doc),
      ...ProfileRepository.toIdentifier(context, snapshot)
    });
  }

  public buildFirst(context: Context, snapshot: firestore.QuerySnapshot): Profile | null {
    if (snapshot.empty) return null;
    return this.build(context, snapshot.docs[0]);
  }

  public buildAll(context: Context, snapshot: firestore.QuerySnapshot): Profile[] {
    return snapshot.docs.map((doc) => this.build(context, doc)).removeNone();
  }

  private static getDocumentReference(profile: Profile) {
    return DocumentScheme.profile(profile.target.id, profile.id);
  }

  private static toIdentifier(context: Context, snapshot: firestore.DocumentSnapshot): ProfileIdentifier {
    const targetUserId = snapshot.ref.parent?.parent?.id;
    if (!targetUserId) throw Error();

    return {
      id: snapshot.id,
      target: new User(context, { id: targetUserId })
    };
  }

  private static toProps(context: Context, doc: ProfileDocument): ProfileProps {
    return {
      content: doc.content,
      index: doc.index,
      author: new User(context, { id: doc.authorUserId })
    };
  }

  private static toDocument(props: ProfileProps): ProfileDocument {
    return {
      content: props.content,
      index: props.index,
      authorUserId: props.author.id
    };
  }

  async getById(context: Context, userId: string, profileId: string): Promise<Profile | null> {
    const snapshot = await DocumentScheme.profile(userId, profileId).get();
    return this.build(context, snapshot);
  }

  public async getByIndex(context: Context, index: number): Promise<Profile | null> {
    console.log(`client ${context.clientUser.id}`);
    const snapshot = await DocumentScheme.profiles(context.clientUser.id).where("index", "==", index).get();
    return this.buildFirst(context, snapshot);
  }

  public async getAll(context: Context, props: { user: User }): Promise<Profile[]> {
    const snapshot = await DocumentScheme.profiles(props.user.id).get();
    return this.buildAll(context, snapshot);
  }

  public async create(context: Context, props: CreateProps): Promise<Profile> {
    const id = await db.runTransaction(async (transaction) => {
      const userDocRef = DocumentScheme.user(props.target.id);
      const userSnapshot = await transaction.get(userDocRef);
      if (!userSnapshot?.exists) throw Error();
      const userDoc = userSnapshot.data() as UserDocument;

      const profileDoc = ProfileRepository.toDocument({ ...props, index: userDoc.profileIndex });
      const profileDocRef = DocumentScheme.profiles(props.target.id).doc();
      transaction.create(profileDocRef, profileDoc);

      const afterUserDoc: UserDocument = { ...userDoc, profileIndex: userDoc.profileIndex + 1 };
      transaction.update(userDocRef, afterUserDoc);

      return profileDocRef.id;
    });

    return new Profile(context, { ...props, id });
  }

  public async delete(profile: Profile) {
    const t = ProfileRepository.getDocumentReference(profile);
    console.log(`delete ${t.path}`);
    await ProfileRepository.getDocumentReference(profile).delete();
  }
}

type CreateProps = Omit<ProfileProps, "index"> & {
  target: User;
};
