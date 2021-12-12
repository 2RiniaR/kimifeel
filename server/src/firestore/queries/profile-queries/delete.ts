import { DocumentScheme } from "../../scheme";

export async function deleteProfile(userId: string, profileId: string) {
  await DocumentScheme.profile({ userId, profileId }).delete();
}
