import { DocumentScheme } from "~/models/repositories/documents/document-scheme";
import { UserDocument } from "~/models/repositories/documents/user-document";
import { UserRepository } from "~/models/repositories/user-repository";
import { ClientUser } from "../context";

export class ClientUserService {
  public async registerIfNotExist(discordId: string): Promise<ClientUser | null> {
    return UserRepository.register({ discordId: discordId });
  }

  public async getByDiscordId(discordId: string): Promise<ClientUser | null> {
    const snapshot = await DocumentScheme.users().where("discordId", "==", discordId).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0].data() as UserDocument;
    const props = UserRepository.toProps(doc);
    return new ClientUser({ ...props, id: snapshot.docs[0].id });
  }
}
