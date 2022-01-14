import { ImaginaryUser, ClientUser } from "../structures";
import { DataAccessFailedError } from "../errors";
import { buildClientUser } from "../builders/client-user";
import * as db from "../../prisma";

export class ClientUserManager {
  private readonly service = new ClientUserManagerService();

  public async register(discordId: string): Promise<ClientUser> {
    const user = new ImaginaryUser({ discordId });
    return await user.create();
  }

  public async findByDiscordId(discordId: string): Promise<ClientUser | undefined> {
    return await this.service.findByDiscordId(discordId);
  }
}

export class ClientUserManagerService {
  public async findByDiscordId(discordId: string): Promise<ClientUser | undefined> {
    let result;
    try {
      result = await db.findUserByDiscordId(discordId);
    } catch (error) {
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    if (!result) return;
    return buildClientUser(result);
  }
}
