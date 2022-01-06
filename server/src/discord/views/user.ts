import { CustomMessageEmbed } from "./base";

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

const removeRegex = /^<@(\d+)>$/;
export function removeMention(mention: string): string {
  return mention.replace(removeRegex, "$1");
}
