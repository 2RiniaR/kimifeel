import { Communicator, Message, ReplyOptions, SystemMessage } from "../../structures";

export abstract class MessageCommandCommunicator<T = void> implements Communicator<T> {
  protected constructor(public readonly command: Message) {}

  public abstract getProps(): T;

  public getSenderId(): string {
    return this.command.raw.author.id;
  }

  public reply(message: SystemMessage, options: ReplyOptions = {}) {
    return this.command.reply(message, options);
  }
}
