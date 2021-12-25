import { SystemMessageEmbed } from "./system-message-embed";
import { getUserReference } from "../utils/user-reference";

export type UserRegisteredEmbedProps = {
  discordId: string;
};

export class UserRegisteredEmbed extends SystemMessageEmbed {
  public constructor({ discordId }: UserRegisteredEmbedProps) {
    super("succeed", "ユーザーが登録されました！", getUserReference(discordId));
  }
}
