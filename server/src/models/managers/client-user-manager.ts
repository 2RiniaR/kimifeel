import { ClientUser } from "~/models";
import { ImaginaryUser } from "~/models/structures/user";

export class ClientUserManager {
  public async registerIfNotExist(discordId: string): Promise<ClientUser> {
    const user = new ImaginaryUser({ discordId });
    return await user.createIfNotExist();
  }
}
