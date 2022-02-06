import { SystemMessage } from "./system-message";

export type ReplyOptions = {
  mentions?: string[];
  reactions?: string[];
};

export interface Communicator<T> {
  raw: T;
  reply(message: SystemMessage, options: ReplyOptions): PromiseLike<void>;
}
