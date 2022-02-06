import { SystemMessage } from "../structures";
import { DiscordUser } from "../structures/discord-user";

export type ReplyOptions = {
  mentions?: DiscordUser[];
  reactions?: string[];
};

export interface Communicator<T> {
  getProps(): T;
  getSenderId(): string;
  reply(message: SystemMessage, options?: ReplyOptions): PromiseLike<void>;
}
