import { DocumentScheme } from "firestore/scheme";
import { extractAllResults, RequestQueryResult } from "./result";

export type SearchReceivedProps = {
  status: "received";
  order: "latest" | "oldest";
  start: number;
  count: number;
  userId: string;
};

export type SearchSentProps = {
  status: "sent";
  order: "latest" | "oldest";
  start: number;
  count: number;
  userId: string;
};

export type SearchProps = SearchReceivedProps | SearchSentProps;

export async function searchRequests(props: SearchProps): Promise<RequestQueryResult[]> {
  let queryField;
  if (props.status === "received") {
    queryField = DocumentScheme.requests({ userId: props.userId });
  } else {
    queryField = DocumentScheme.allRequests().where("requesterUserId", "==", props.userId);
  }

  let query: FirebaseFirestore.Query = queryField;
  if (props.order === "latest") {
    query = queryField.orderBy("index", "desc").startAt(props.start).limit(props.count);
  } else if (props.order === "oldest") {
    query = queryField.orderBy("index", "asc").startAt(props.start).limit(props.count);
  }

  const snapshot = await query.get();
  return extractAllResults(snapshot);
}
