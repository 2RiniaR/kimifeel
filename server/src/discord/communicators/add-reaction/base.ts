import { DiscordUserIdentity, Reaction, SystemMessage } from "../../structures";
import { Communicator, ReplyOptions } from "../../actions";

export abstract class ReactionCommunicator<T = void> implements Communicator<T> {
  public constructor(public readonly reaction: Reaction) {}

  public abstract getProps(): T;

  public getSender(): DiscordUserIdentity {
    return this.reaction.message.author;
  }

  public reply(message: SystemMessage, options: ReplyOptions = {}) {
    return this.reaction.message.reply(message, options);
  }
}
