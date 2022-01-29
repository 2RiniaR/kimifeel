import { CheckMentionableResult } from "../../endpoints/user";

export function filterMentionable(result: CheckMentionableResult): string[] {
  return Object.keys(result).filter((id) => result[id]);
}
