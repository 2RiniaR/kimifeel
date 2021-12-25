import { ImaginaryUser, ClientUser } from "../structures";
import { findUserByDiscordId } from "../../prisma";
import { buildClientUser } from "../builders/client-user";

export class ClientUserManager {
  public async register(discordId: string): Promise<ClientUser> {
    const user = new ImaginaryUser({ discordId });
    return await user.create();
  }

  public async findByDiscordId(discordId: string): Promise<ClientUser | undefined> {
    const result = await findUserByDiscordId(discordId);
    if (!result) return;
    return buildClientUser(result);
  }
}
