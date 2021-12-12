import { DocumentScheme } from "models/scheme";
import { extractAllResults, RequestQueryResult } from "./result";

type RangeProps = {
  start: number;
  count: number;
};

type ConditionProps = {
  ownerUserId?: string;
  authorUserId?: string;
  content?: string;
};

export type SearchProps = (({ order: "latest" | "oldest" } & RangeProps) | { order: "random" }) & ConditionProps;

export async function searchRequests(props: SearchProps): Promise<RequestQueryResult[]> {
  let queryField;
  if (props.ownerUserId) {
    queryField = DocumentScheme.requests({ userId: props.ownerUserId });
  } else {
    queryField = DocumentScheme.allRequests();
  }

  let query: FirebaseFirestore.Query = queryField;

  if (props.authorUserId) {
    query = query.where("authorUserId", "==", props.authorUserId);
  }

  if (props.content) {
    query = query.where("content", ">=", props.content).where("content", "<=", props.content + "\uf8ff");
  }

  if (props.order === "latest") {
    query = queryField.orderBy("index", "desc").startAt(props.start).limit(props.count);
  } else if (props.order === "oldest") {
    query = queryField.orderBy("index", "asc").startAt(props.start).limit(props.count);
  }

  const snapshot = await query.get();
  return extractAllResults(snapshot);
}
