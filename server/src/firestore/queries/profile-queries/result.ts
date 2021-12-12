import { ProfileDocument, ProfileDocumentPath } from "../../scheme";
import { MultipleQueryResult, SingleQueryResult } from "../query-results";

export type ProfileQueryResult = ProfileDocument & ProfileDocumentPath;

export function extractResult(snapshot: SingleQueryResult): ProfileQueryResult | undefined {
  const userId = snapshot.ref.parent?.parent?.id;
  if (!snapshot.exists || !userId) return;
  const doc = snapshot.data() as ProfileDocument;
  const path: ProfileDocumentPath = { userId, profileId: snapshot.id };
  return { ...doc, ...path };
}

export function extractFirstResult(snapshot: MultipleQueryResult): ProfileQueryResult | undefined {
  if (snapshot.empty) return;
  return extractResult(snapshot.docs[0]);
}

export function extractAllResults(snapshot: MultipleQueryResult): ProfileQueryResult[] {
  return snapshot.docs.map((doc) => extractResult(doc)).removeNone();
}
