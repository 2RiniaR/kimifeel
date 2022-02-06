import { FindManyResult } from "../../app/endpoints/user";

export function filterMentionable(result: FindManyResult): string[] {
  return Object.keys(result).filter((id) => result[id]);
}
