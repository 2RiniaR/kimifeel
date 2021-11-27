import { Profile, ProfileIdentifier, ProfileProps } from "../structures/profile";
import { DocumentScheme } from "./documents/document-scheme";
import { ProfileDocument } from "./documents/profile-document";
import { User } from "../structures/user";
import { db } from "~/firebase";
import { firestore } from "firebase-admin";
import { UserDocument } from "~/models/repositories/documents/user-document";
import { ContextModel } from "../context";

export class ProfileRepository extends ContextModel {
  public build(snapshot: firestore.DocumentSnapshot): Profile | null {
    if (!snapshot?.exists) return null;
    const doc = snapshot.data() as ProfileDocument;
    return new Profile(this.context, { ...this.toProps(doc), ...this.toIdentifier(snapshot) });
  }

  public buildFirst(snapshot: firestore.QuerySnapshot): Profile | null {
    if (snapshot.empty) return null;
    return this.build(snapshot.docs[0]);
  }

  public buildAll(snapshot: firestore.QuerySnapshot): Profile[] {
    return snapshot.docs.map((doc) => this.build(doc)).removeNone();
  }

  private static getDocumentReference(profile: Profile) {
    return DocumentScheme.profile(profile.target.id, profile.id);
  }

  private toIdentifier(snapshot: firestore.DocumentSnapshot): ProfileIdentifier {
    return {
      id: snapshot.id,
      target: new User(this.context, { id: snapshot.ref.id })
    };
  }

  private toProps(doc: ProfileDocument): ProfileProps {
    return {
      content: doc.content,
      index: doc.index,
      author: new User(this.context, { id: doc.authorUserId })
    };
  }

  private static toDocument(props: ProfileProps): ProfileDocument {
    return {
      content: props.content,
      index: props.index,
      authorUserId: props.author.id
    };
  }

  async getById(userId: string, profileId: string): Promise<Profile | null> {
    const snapshot = await DocumentScheme.profile(userId, profileId).get();
    return this.build(snapshot);
  }

  public async getByIndex(index: number): Promise<Profile | null> {
    const snapshot = await DocumentScheme.profiles(this.context.clientUser.id).where("index", "==", index).get();
    return this.repositories.profiles.buildFirst(snapshot);
  }

  public async getAll(props: { user: User }): Promise<Profile[]> {
    const snapshot = await DocumentScheme.profiles(props.user.id).get();
    return this.buildAll(snapshot);
  }

  public async create(props: CreateProps): Promise<Profile> {
    console.log("repository-1");
    const profileDocRef = await db.runTransaction(async (transaction) => {
      const userSnapshot = await transaction.get(DocumentScheme.user(props.target.id));
      if (!userSnapshot?.exists) throw Error();
      const userDoc = userSnapshot.data() as UserDocument;
      const profileDoc = ProfileRepository.toDocument({ ...props, index: userDoc.profileIndex });
      const profileDocRef = DocumentScheme.profiles(props.target.id).doc();
      transaction.create(profileDocRef, profileDoc);
      return profileDocRef;
    });
    console.log("repository-2");
    return new Profile(this.context, {
      ...props,
      id: profileDocRef.id
    });
  }

  public async delete(profile: Profile) {
    await ProfileRepository.getDocumentReference(profile).delete();
  }
}

type CreateProps = Omit<ProfileProps, "index"> & {
  target: User;
};
