import { ClientUser } from "../structures";
import * as db from "prisma";

export function buildClientUser(result: db.UserQueryResult): ClientUser {
  return new ClientUser({
    id: result.id,
    discordId: result.discordId
  });
}
