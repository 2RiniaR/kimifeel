import { toMention } from "./user";
import { ProfileSpecifier } from "app/endpoints/structures";
import { SystemMessage } from "../structures";

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

function getIdentityCall(specifier: ProfileSpecifier) {
  if ("id" in specifier) return `プロフィール ID: \`${specifier.id}\``;
  else return `プロフィール 番号: \`${specifier.index}\``;
}

export class ProfileCreatedMessage extends SystemMessage {
  public constructor(profile: ProfileProps) {
    super();
    this.type = "succeed";
    this.title = "プロフィールを作成しました！";
    this.message = toProfileUnit(profile, true);
  }
}

export class ProfileDeletedMessage extends SystemMessage {
  public constructor(profile: ProfileProps) {
    super();
    this.type = "deleted";
    this.title = "プロフィールを削除しました";
    this.message = toProfileUnit(profile, false);
  }
}

export class ProfileListMessage extends SystemMessage {
  public constructor(profiles: ProfileProps[]) {
    super();
    this.type = "profile";
    this.title = "プロフィール";
    if (profiles.length > 0) {
      this.message = profiles.map((element) => toProfileUnit(element)).join("\n\n");
    } else {
      this.message = "該当する結果はありませんでした。";
    }
  }
}

export class ProfileNotFoundMessage extends SystemMessage {
  public constructor(specifier: ProfileSpecifier) {
    super();
    this.type = "failed";
    this.title = "プロフィールが見つかりませんでした";
    const identity = getIdentityCall(specifier);
    this.message = `${identity} は存在しない、もしくは削除された可能性があります。`;
  }
}

export class ProfileContentLengthLimitMessage extends SystemMessage {
  public constructor(min: number, max: number, actual: number) {
    super();
    this.type = "invalid";
    this.title = "内容が長すぎます";
    this.message = `\`${min}\`文字以上、かつ\`${max}\`文字以下にしてください。（現在：\`${actual}\`文字）`;
  }
}
