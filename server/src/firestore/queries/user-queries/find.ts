import { DocumentScheme } from "models/scheme";
import { extractFirstResult, extractResult, UserQueryResult } from "./result";

export async function findUserById(userId: string): Promise<UserQueryResult | undefined> {
  const snapshot = await DocumentScheme.user({ userId }).get();
  return extractResult(snapshot);
}

export async function findUserByDiscordId(discordId: string): Promise<UserQueryResult | undefined> {
  const snapshot = await DocumentScheme.users().where("discordId", "==", discordId).get();
  return extractFirstResult(snapshot);
}
