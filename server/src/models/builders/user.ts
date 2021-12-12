import { Context } from "../context";
import { UserQueryResult } from "firestore/queries/user-queries";
import { User } from "../structures";

export function buildUser(context: Context, result: UserQueryResult): User {
  return new User(context, {
    id: result.userId,
    discordId: result.discordId
  });
}
