import { UserQueryResult } from "../queries/user";
import { ClientUser } from "../structures";

export function buildClientUser(result: UserQueryResult): ClientUser {
  return new ClientUser({
    id: result.userId,
    discordId: result.discordId
  });
}
