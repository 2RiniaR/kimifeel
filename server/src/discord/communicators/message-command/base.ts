import { DiscordUserIdentity, MessageCommand, SystemMessage } from "../../structures";
import { Communicator, ReplyOptions } from "../../actions";

export abstract class MessageCommandCommunicator<T = void> implements Communicator<T> {
  public constructor(public readonly message: MessageCommand) {}

  public abstract getProps(): T;

  public getSender(): DiscordUserIdentity {
    return this.message.author;
  }

  public reply(message: SystemMessage, options: ReplyOptions = {}) {
    return this.message.reply(message, options);
  }
}
