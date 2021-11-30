import { ImaginaryUser, ClientUser } from "../structures";

export class ClientUserManager {
  public async registerIfNotExist(discordId: string): Promise<ClientUser> {
    const user = new ImaginaryUser({ discordId });
    return await user.createIfNotExist();
  }
}
