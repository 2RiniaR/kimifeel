import { User } from "../structures/user";
import { ContextModel } from "../context/";

export class UserService extends ContextModel {
  public async getByDiscordId(discordId: string): Promise<User | null> {
    return this.repositories.users.getByDiscordId(discordId);
  }
}
