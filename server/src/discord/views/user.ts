import { UserBody, UserSpecifier, UserStatsBody } from "app/endpoints/structures";
import { SystemMessage } from "../structures";

export type UserProps = {
  discordId: string;
};

export function toMention(userId: string): string {
  return `<@${userId}>`;
}

function getIdentityCall(specifier: UserSpecifier) {
  if ("id" in specifier) return `ユーザー ID: \`${specifier.id}\``;
  else return toMention(specifier.discordId);
}

const removeRegex = /^<@(\d+)>$/;
export function removeMention(mention: string): string {
  return mention.replace(removeRegex, "$1");
}

export class UserRegisteredEmbed extends SystemMessage {
  public constructor({ discordId }: UserProps) {
    super();
    this.type = "succeed";
    this.title = "ユーザーが登録されました！";
    this.message = toMention(discordId);
  }
}

export class UserRegisterRequiredEmbed extends SystemMessage {
  public constructor() {
    super();
    this.type = "info";
    this.title = "ユーザーが登録されていません";
    this.message = [
      "当サービスを使用するには、ユーザー登録をしてください。",
      "```",
      "▼ スラッシュコマンドの場合",
      "/user register",
      "",
      "▼ メッセージに直接入力する場合",
      "!kimi user register",
      "```"
    ].join("\n");
  }
}

export class UserAlreadyRegisteredEmbed extends SystemMessage {
  public constructor(specifier: UserSpecifier) {
    super();
    this.type = "failed";
    this.title = "ユーザー登録に失敗しました";
    const identity = getIdentityCall(specifier);
    this.message = `${identity} は既に登録されています`;
  }
}

export class UserNotFoundEmbed extends SystemMessage {
  public constructor(specifier: UserSpecifier) {
    super();
    this.type = "failed";
    this.title = "ユーザーが見つかりませんでした";
    const identity = getIdentityCall(specifier);
    this.message = `${identity} は存在しない、もしくは削除された可能性があります。`;
  }
}

export class UserStatsEmbed extends SystemMessage {
  public constructor(user: UserStatsBody) {
    super();
    const mention = `**${toMention(user.discordId)}**`;
    const owned = `書かれたプロフィール: ${user.ownedProfileCount} 件 (うち自己紹介 ${user.selfProfileCount} 件)`;
    const written = `書いたプロフィール: ${user.writtenProfileCount} 件`;

    this.type = "user";
    this.title = "ユーザー";
    this.message = [mention, "```", owned, written, "```"].join("\n");
  }
}

export class UserConfiguredEmbed extends SystemMessage {
  public constructor(user: UserBody) {
    super();
    const mention = `**${toMention(user.discordId)}**`;
    const enableMention = `メンション: ${user.enableMention ? "ON" : "OFF"}`;

    this.type = "user";
    this.title = "ユーザー";
    this.message = [mention, "```", enableMention, "```"].join("\n");
  }
}

export function mentionUsers(usersId: readonly string[]) {
  return usersId.map((id) => toMention(id)).join(", ");
}
