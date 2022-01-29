import { Context } from "../context";
import { User } from "../structures";
import * as db from "../../prisma";

export function buildUser(context: Context, result: db.UserQueryResult): User {
  return new User(context, {
    id: result.id,
    discordId: result.discordId,
    enableMention: result.enableMention
  });
}
