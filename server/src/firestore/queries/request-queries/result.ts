import { RequestDocument, RequestDocumentPath } from "models/scheme";
import { MultipleQueryResult, SingleQueryResult } from "../query-results";

export type RequestQueryResult = RequestDocument & RequestDocumentPath;

export function extractResult(snapshot: SingleQueryResult): RequestQueryResult | undefined {
  const userId = snapshot.ref.parent?.parent?.id;
  if (!snapshot.exists || !userId) return;
  const doc = snapshot.data() as RequestDocument;
  const path: RequestDocumentPath = { userId, requestId: snapshot.id };
  return { ...doc, ...path };
}

export function extractFirstResult(snapshot: MultipleQueryResult): RequestQueryResult | undefined {
  if (snapshot.empty) return;
  return extractResult(snapshot.docs[0]);
}

export function extractAllResults(snapshot: MultipleQueryResult): RequestQueryResult[] {
  return snapshot.docs.map((doc) => extractResult(doc)).removeNone();
}
