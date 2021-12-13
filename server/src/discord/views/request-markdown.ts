import { getUserReference } from "../utils/user-reference";

export type RequestMarkdownProps = {
  index: number;
  content: string;
  requesterUserId: string;
  targetUserId: string;
};
export function getRequestAbstractMarkdown({ index, requesterUserId, targetUserId }: RequestMarkdownProps): string {
  return `**${getUserReference(targetUserId)} No.${index}** - *by ${getUserReference(requesterUserId)}*`;
}

export function getRequestMarkdown({ index, content, requesterUserId, targetUserId }: RequestMarkdownProps): string {
  return `**${getUserReference(targetUserId)} No.${index}** - *by ${getUserReference(
    requesterUserId
  )}*\`\`\`\n${content}\n\`\`\``;
}
