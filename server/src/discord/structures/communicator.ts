import { SystemMessage, DiscordUser } from "./index";

export type ReplyOptions = {
  mentions?: DiscordUser[];
  reactions?: string[];
  showOnlySender?: boolean;
};

export interface Communicator<T> {
  getProps(): T;
  getSenderId(): string;
  reply(message: SystemMessage, options?: ReplyOptions): PromiseLike<void>;
}
