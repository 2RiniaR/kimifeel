import { DocumentScheme } from "../../scheme";
import { extractAllResults, extractFirstResult, extractResult, ProfileQueryResult } from "./result";

export async function findProfileById(userId: string, profileId: string): Promise<ProfileQueryResult | undefined> {
  const snapshot = await DocumentScheme.profile({ userId, profileId }).get();
  return extractResult(snapshot);
}

export async function findProfileByIndex(userId: string, index: number): Promise<ProfileQueryResult | undefined> {
  const snapshot = await DocumentScheme.profiles({ userId }).where("index", "==", index).get();
  return extractFirstResult(snapshot);
}

export async function findAllProfiles(userId: string): Promise<ProfileQueryResult[]> {
  const snapshot = await DocumentScheme.profiles({ userId }).get();
  return extractAllResults(snapshot);
}
