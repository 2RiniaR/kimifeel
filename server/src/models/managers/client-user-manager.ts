import { ClientUser } from "~/models";
import { createUserIfNotExist } from "~/models/repositories/queries/user";
import { buildClientUser } from "~/models/repositories/builders/client-user";

export class ClientUserManager {
  public async registerIfNotExist(discordId: string): Promise<ClientUser> {
    const result = await createUserIfNotExist({ discordId });
    return buildClientUser(result);
  }
}
