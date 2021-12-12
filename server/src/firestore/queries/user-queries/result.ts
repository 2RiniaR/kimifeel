import { UserDocument, UserDocumentPath } from "firestore/scheme";
import { MultipleQueryResult, SingleQueryResult } from "../query-results";

export type UserQueryResult = UserDocument & UserDocumentPath;

export function extractResult(snapshot: SingleQueryResult): UserQueryResult | undefined {
  if (!snapshot.exists) return;
  const doc = snapshot.data() as UserDocument;
  const path: UserDocumentPath = { userId: snapshot.id };
  return { ...doc, ...path };
}

export function extractFirstResult(snapshot: MultipleQueryResult): UserQueryResult | undefined {
  if (snapshot.empty) return;
  return extractResult(snapshot.docs[0]);
}
