import { CustomMessageEmbed } from "./base";
import { UserIdentifier } from "endpoints/structures";

export type UserProps = {
  discordId: string;
};

export class UserRegisteredEmbed extends CustomMessageEmbed {
  public constructor({ discordId }: UserProps) {
    super("succeed", "ユーザーが登録されました！", toMention(discordId));
  }
}

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

export function mentionUsers(usersId: readonly string[]) {
  return usersId.map((id) => toMention(id)).join(", ");
}
