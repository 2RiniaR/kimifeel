import { SystemMessage, SystemMessageRead } from "./system-message";
import { DiscordUser, DiscordUserIdentity } from "./discord-user";

export type MessageReplyOptions = {
  readonly mentions?: DiscordUser[];
  readonly reactions?: string[];
};

export interface Message {
  author: DiscordUserIdentity;
  readSystemMessage(): SystemMessageRead;
  reply(message: SystemMessage, options: MessageReplyOptions): Promise<void>;
}
