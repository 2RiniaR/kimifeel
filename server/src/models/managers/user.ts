import { IdentityUser, User } from "../structures";
import { ContextModel } from "../context-model";
import { buildUser } from "../builders/user";
import { NotFoundError } from "../errors";
import * as db from "../../prisma";

export class UserManager extends ContextModel {
  public async fetch(user: IdentityUser): Promise<User> {
    const result = await db.findUser(user.id);
    if (!result) {
      throw new NotFoundError("Tried to fetch data, but it wasn't found.");
    }
    return buildUser(this.context, result);
  }

  public async findByDiscordId(discordId: string): Promise<User | undefined> {
    const result = await db.findUserByDiscordId(discordId);
    if (!result) return;
    return buildUser(this.context, result);
  }
}
