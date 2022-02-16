import { Message } from "./message";
import { DiscordUserIdentity } from "./discord-user";

export interface Reaction {
  message: Message;
  reactedUser: DiscordUserIdentity;
}
