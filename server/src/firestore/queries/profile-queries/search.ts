import { DocumentScheme } from "../../scheme";
import { extractAllResults, ProfileQueryResult } from "./result";

type ConditionProps = {
  ownerUserId?: string;
  authorUserId?: string;
  content?: string;
};

export type SearchProps = (
  | {
      order: "latest" | "oldest";
      start: number;
      count: number;
    }
  | {
      order: "random";
      count: number;
    }
) &
  ConditionProps;

export async function searchProfiles(props: SearchProps): Promise<ProfileQueryResult[]> {
  let queryField;
  if (props.ownerUserId) {
    queryField = DocumentScheme.profiles({ userId: props.ownerUserId });
  } else {
    queryField = DocumentScheme.allProfiles();
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
  } else if (props.order === "random") {
    query = queryField.limit(props.count);
  }

  const snapshot = await query.get();
  return extractAllResults(snapshot);
}
