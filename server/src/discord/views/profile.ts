import { CustomMessageEmbed } from "./base";
import { toMention } from "./user";

export type ProfileProps = {
  index: number;
  content: string;
  ownerUserId: string;
  authorUserId: string;
};

export function toProfileUnit({ index, content, authorUserId, ownerUserId }: ProfileProps, showDetail = true): string {
  if (showDetail) {
    return `**${toMention(ownerUserId)} No.${index}** - *by ${toMention(authorUserId)}*\`\`\`\n${content}\n\`\`\``;
  } else {
    return `**${toMention(ownerUserId)} No.${index}** - *by ${toMention(authorUserId)}*`;
  }
}

export class ProfileDeletedEmbed extends CustomMessageEmbed {
  public constructor(profile: ProfileProps) {
    super("deleted", "プロフィールを削除しました。", toProfileUnit(profile, false));
  }
}

export class ProfileListEmbed extends CustomMessageEmbed {
  public constructor(profiles: ProfileProps[]) {
    super("profile", "プロフィール", profiles.map((element) => toProfileUnit(element)).join("\n"));
  }
}
