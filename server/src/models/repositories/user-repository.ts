import { User, UserProps } from "../structures/user";
import { UserDocument } from "./documents/user-document";
import { DocumentScheme } from "./documents/document-scheme";
import { ClientUser, Context } from "../context";
import { firestore } from "firebase-admin";

export class UserRepository {
  public build(context: Context, snapshot: firestore.DocumentSnapshot): User | null {
    if (!snapshot?.exists) return null;
    const doc = snapshot.data() as UserDocument;
    const props = UserRepository.toProps(doc);
    return new User(context, { ...props, id: snapshot.id });
  }

  public buildFirst(context: Context, snapshot: firestore.QuerySnapshot): User | null {
    if (snapshot.empty) return null;
    return this.build(context, snapshot.docs[0]);
  }

  public static toProps(doc: UserDocument): UserProps {
    return {
      discordId: doc.discordId
    };
  }

  public async getById(context: Context, id: string): Promise<User | null> {
    const snapshot = await DocumentScheme.user(id).get();
    return this.build(context, snapshot);
  }

  public async getByDiscordId(context: Context, discordId: string): Promise<User | null> {
    const snapshot = await DocumentScheme.users().where("discordId", "==", discordId).get();
    return this.buildFirst(context, snapshot);
  }

  public static async register(props: RegisterProps): Promise<ClientUser> {
    const doc: UserDocument = {
      discordId: props.discordId,
      profileIndex: 1,
      requestIndex: 1
    };
    const ref = await DocumentScheme.users().add(doc);
    const userProps: UserProps = { discordId: props.discordId };
    return new ClientUser({ ...userProps, id: ref.id });
  }
}

type RegisterProps = {
  discordId: string;
};
