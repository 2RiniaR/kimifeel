import { getUserReference } from "../utils/user-reference";

export type ProfileMarkdownProps = {
  index: number;
  content: string;
  authorUserId: string;
};

export function getProfileMarkdown({ index, content, authorUserId }: ProfileMarkdownProps): string {
  return `**No.${index}** - *by ${getUserReference(authorUserId)}*\`\`\`\n${content}\n\`\`\``;
}
