import { Context } from "../context";
import { User } from "../structures";
import { UserQueryResult } from "../../prisma";

export function buildUser(context: Context, result: UserQueryResult): User {
  return new User(context, {
    id: result.id,
    discordId: result.discordId
  });
}
