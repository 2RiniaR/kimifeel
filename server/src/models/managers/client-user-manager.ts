import { ClientUser } from "../context";
import { createUserIfNotExist, getUserByDiscordId } from "~/models/repositories/queries/user";
import { buildClientUser } from "~/models/repositories/builders/client-user";

export class ClientUserManager {
  public async registerIfNotExist(discordId: string): Promise<ClientUser> {
    const result = await createUserIfNotExist({ discordId });
    return buildClientUser(result);
  }

  public async getByDiscordId(discordId: string): Promise<ClientUser | undefined> {
    const result = await getUserByDiscordId(discordId);
    if (!result) return;
    return buildClientUser(result);
  }
}
