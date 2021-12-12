import { DocumentScheme } from "firestore/scheme";
import { extractAllResults, extractResult, extractFirstResult, RequestQueryResult } from "./result";

export async function findRequestById(userId: string, requestId: string): Promise<RequestQueryResult | undefined> {
  const snapshot = await DocumentScheme.request({ userId, requestId }).get();
  return extractResult(snapshot);
}

export async function findRequestByIndex(userId: string, index: number): Promise<RequestQueryResult | undefined> {
  const snapshot = await DocumentScheme.requests({ userId }).where("index", "==", index).get();
  return extractFirstResult(snapshot);
}

export async function findAllRequests(userId: string): Promise<RequestQueryResult[]> {
  const snapshot = await DocumentScheme.requests({ userId }).get();
  return extractAllResults(snapshot);
}
