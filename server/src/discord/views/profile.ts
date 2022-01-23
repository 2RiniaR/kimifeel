import { CustomMessageEmbed } from "./base";
import { toMention } from "./user";
import { ProfileIdentifier } from "endpoints/structures";

export type ProfileProps = {
  index: number;
  content: string;
  ownerUserId: string;
  authorUserId: string;
};

export function toProfileUnit({ index, content, authorUserId, ownerUserId }: ProfileProps, showDetail = true): string {
  if (showDetail) {
    return `**No.${index}** ${toMention(ownerUserId)}\`\`\`\n${content}\n\`\`\` ―――― *by ${toMention(authorUserId)}*`;
  } else {
    return `**No.${index}** ${toMention(ownerUserId)} ―――― *by ${toMention(authorUserId)}*`;
  }
}

function getIdentityCall(identifier: ProfileIdentifier) {
  if ("id" in identifier) return `プロフィール ID: \`${identifier.id}\``;
  else return `プロフィール 番号: \`${identifier.index}\``;
}

export class ProfileCreatedEmbed extends CustomMessageEmbed {
  public constructor(profile: ProfileProps) {
    super("succeed", "プロフィールを作成しました！", toProfileUnit(profile, true));
  }
}

export class ProfileDeletedEmbed extends CustomMessageEmbed {
  public constructor(profile: ProfileProps) {
    super("deleted", "プロフィールを削除しました。", toProfileUnit(profile, false));
  }
}

export class ProfileListEmbed extends CustomMessageEmbed {
  public constructor(profiles: ProfileProps[]) {
    super("profile", "プロフィール", profiles.map((element) => toProfileUnit(element)).join("\n\n"));
  }
}

export class ProfileNotFoundEmbed extends CustomMessageEmbed {
  public constructor(identifier: ProfileIdentifier) {
    const identity = getIdentityCall(identifier);
    super(
      "failed",
      "プロフィールが見つかりませんでした。",
      `${identity} は存在しない、もしくは削除された可能性があります。`
    );
  }
}

export class ProfileContentLengthLimitEmbed extends CustomMessageEmbed {
  public constructor(min: number, max: number, actual: number) {
    super(
      "invalid",
      "内容が長すぎます",
      `\`${min}\`文字以上、かつ\`${max}\`文字以下にしてください。（現在：\`${actual}\`文字）`
    );
  }
}
