import { DocumentScheme } from "models/scheme";

export async function deleteRequest(userId: string, requestId: string) {
  await DocumentScheme.request({ userId, requestId }).delete();
}
