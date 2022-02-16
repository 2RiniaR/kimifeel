import { SystemMessage, DiscordUser, DiscordUserIdentity } from "../structures";

export type ReplyOptions = {
  readonly mentions?: DiscordUser[];
  readonly reactions?: string[];
  readonly showOnlyActive?: boolean;
  readonly showOnlySender?: boolean;
};

export interface Communicator<T = void> {
  getProps(): T;
  getSender(): DiscordUserIdentity;
  reply(message: SystemMessage, options?: ReplyOptions): PromiseLike<void>;
}
