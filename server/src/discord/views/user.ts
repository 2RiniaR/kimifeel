import { CustomMessageEmbed } from "./base";
import { UserResult, UserIdentifier, UserStats } from "endpoints/structures";

export type UserProps = {
  discordId: string;
};

export function toMention(userId: string): string {
  return `<@${userId}>`;
}

function getIdentityCall(identifier: UserIdentifier) {
  if ("id" in identifier) return `ユーザー ID: \`${identifier.id}\``;
  else return toMention(identifier.discordId);
}

const removeRegex = /^<@(\d+)>$/;
export function removeMention(mention: string): string {
  return mention.replace(removeRegex, "$1");
}

export class UserRegisteredEmbed extends CustomMessageEmbed {
  public constructor({ discordId }: UserProps) {
    super("succeed", "ユーザーが登録されました！", toMention(discordId));
  }
}

export class UserRegisterRequiredEmbed extends CustomMessageEmbed {
  public constructor() {
    const message = [
      "当サービスを使用するには、ユーザー登録をしてください。",
      "```",
      "▼ スラッシュコマンドの場合",
      "/user register",
      "",
      "▼ メッセージに直接入力する場合",
      "!kimi user register",
      "```"
    ].join("\n");
    super("info", "ユーザーが登録されていません", message);
  }
}

export class UserAlreadyRegisteredEmbed extends CustomMessageEmbed {
  public constructor(identifier: UserIdentifier) {
    const identity = getIdentityCall(identifier);
    super("failed", "ユーザー登録に失敗しました", `${identity} は既に登録されています`);
  }
}

export class UserNotFoundEmbed extends CustomMessageEmbed {
  public constructor(identifier: UserIdentifier) {
    const identity = getIdentityCall(identifier);
    super(
      "failed",
      "ユーザーが見つかりませんでした。",
      `${identity} は存在しない、もしくは削除された可能性があります。`
    );
  }
}

export class UserStatsEmbed extends CustomMessageEmbed {
  public constructor(user: UserStats) {
    const mention = `**${toMention(user.discordId)}**`;
    const owned = `書かれたプロフィール: ${user.ownedProfileCount} 件 (うち自己紹介 ${user.selfProfileCount} 件)`;
    const written = `書いたプロフィール: ${user.writtenProfileCount} 件`;

    const message = [mention, "```", owned, written, "```"].join("\n");
    super("user", "ユーザー", message);
  }
}

export class UserConfiguredEmbed extends CustomMessageEmbed {
  public constructor(user: UserResult) {
    const mention = `**${toMention(user.discordId)}**`;
    const enableMention = `メンション: ${user.enableMention ? "ON" : "OFF"}`;

    const message = [mention, "```", enableMention, "```"].join("\n");
    super("user", "ユーザー", message);
  }
}

export function mentionUsers(usersId: readonly string[]) {
  return usersId.map((id) => toMention(id)).join(", ");
}
