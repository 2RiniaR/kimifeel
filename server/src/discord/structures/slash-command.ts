import { SystemMessage } from "./system-message";
import { DiscordUser, DiscordUserIdentity } from "./discord-user";

export type SlashCommandReplyOptions = {
  mentions?: DiscordUser[];
  reactions?: string[];
  showOnlySender?: boolean;
};

export interface SlashCommand {
  sender: DiscordUserIdentity;

  reply(message: SystemMessage, options: SlashCommandReplyOptions): Promise<void>;

  getInteger(name: string): number;
  getIntegerOptional(name: string): number | undefined;
  getString(name: string): string;
  getStringOptional(name: string): string | undefined;
  getBoolean(name: string): boolean;
  getBooleanOptional(name: string): boolean | undefined;
  getUser(name: string): DiscordUserIdentity;
  getUserOptional(name: string): DiscordUserIdentity | undefined;
}
