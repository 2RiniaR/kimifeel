import { IdentityUser, User } from "../structures";
import { ContextModel } from "../context-model";
import { buildUser } from "../builders/user";
import { findUserByDiscordId, findUserById } from "../../prisma";

export class UserManager extends ContextModel {
  public async findByDiscordId(discordId: string): Promise<User | undefined> {
    const result = await findUserByDiscordId(discordId);
    if (!result) return;
    return buildUser(this.context, result);
  }

  public async fetch(user: IdentityUser): Promise<User> {
    const result = await findUserById(user.id);
    if (!result) {
      throw Error("Tried to fetch data, but it wasn't found.");
    }
    return buildUser(this.context, result);
  }
}
