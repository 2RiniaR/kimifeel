import { DocumentScheme } from "firestore/scheme";

export async function deleteRequest(userId: string, requestId: string) {
  await DocumentScheme.request({ userId, requestId }).delete();
}
