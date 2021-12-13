import { getUserReference } from "../utils/user-reference";

export type ProfileMarkdownProps = {
  index: number;
  content: string;
  ownerUserId: string;
  authorUserId: string;
};

export function getProfileAbstractMarkdown({ index, authorUserId, ownerUserId }: ProfileMarkdownProps): string {
  return `**${getUserReference(ownerUserId)} No.${index}** - *by ${getUserReference(authorUserId)}*`;
}

export function getProfileMarkdown({ index, content, authorUserId, ownerUserId }: ProfileMarkdownProps): string {
  return `**${getUserReference(ownerUserId)} No.${index}** - *by ${getUserReference(
    authorUserId
  )}*\`\`\`\n${content}\n\`\`\``;
}
