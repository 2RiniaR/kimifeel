import { IdentityUser, User } from "../structures/user";
import { ContextModel } from "../context/";
import { getUserByDiscordId, getUserById } from "~/models/repositories/queries/user";
import { buildUser } from "~/models/repositories/builders/user";

export class UserManager extends ContextModel {
  public async getByDiscordId(discordId: string): Promise<User | undefined> {
    const result = await getUserByDiscordId(discordId);
    if (!result) return;
    return buildUser(this.context, result);
  }

  public async fetch(user: IdentityUser): Promise<User> {
    const result = await getUserById(user.id);
    if (!result) {
      throw Error("Tried to fetch data, but it wasn't found.");
    }
    return buildUser(this.context, result);
  }
}
