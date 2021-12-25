import { UserQueryResult } from "prisma/queries";
import { ClientUser } from "../structures";

export function buildClientUser(result: UserQueryResult): ClientUser {
  return new ClientUser({
    id: result.id,
    discordId: result.discordId
  });
}
