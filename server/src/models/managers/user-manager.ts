import { User } from "../structures/user";
import { ContextModel } from "../context/";
import { getUserByDiscordId } from "~/models/repositories/queries/user";
import { buildUser } from "~/models/repositories/builders/user";

export class UserManager extends ContextModel {
  public async getByDiscordId(discordId: string): Promise<User | undefined> {
    const result = await getUserByDiscordId(discordId);
    if (!result) return;
    return buildUser(this.context, result);
  }
}
