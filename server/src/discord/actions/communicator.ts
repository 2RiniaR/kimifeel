import { SystemMessage, DiscordUser, DiscordUserIdentity } from "../structures";

export type ReplyOptions = {
  mentions?: DiscordUser[];
  reactions?: string[];
  showOnlySender?: boolean;
};

export interface Communicator<T = void> {
  getProps(): T;
  getSender(): DiscordUserIdentity;
  reply(message: SystemMessage, options?: ReplyOptions): PromiseLike<void>;
}
