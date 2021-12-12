import { UserQueryResult } from "firestore/queries/user-queries";
import { ClientUser } from "../structures";

export function buildClientUser(result: UserQueryResult): ClientUser {
  return new ClientUser({
    id: result.userId,
    discordId: result.discordId
  });
}
