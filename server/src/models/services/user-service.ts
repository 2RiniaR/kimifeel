import { ContextModel } from "../context/context-model";
import { User } from "../structures/user";

export class UserService extends ContextModel {
  public async getByDiscordId(discordId: string): Promise<User | null> {
    return this.repositories.users.getByDiscordId(discordId);
  }
}
