import {
  CommandArgumentUnexpectedError,
  CommandOptionUnexpectedError,
  DiscordUserIdentity,
  MessageCommand,
  SystemMessage
} from "../../structures";
import { Communicator, ReplyOptions } from "../../actions";

export abstract class MessageCommandCommunicator<T = void> implements Communicator<T> {
  public constructor(public readonly command: MessageCommand) {}

  public abstract getProps(): T;

  public getSender(): DiscordUserIdentity {
    return this.command.message.author;
  }

  public reply(message: SystemMessage, options: ReplyOptions = {}) {
    return this.command.message.reply(message, options);
  }

  public checkArgsCount(args: number) {
    if (this.command.fragments.arguments.length !== args)
      throw new CommandArgumentUnexpectedError(args, this.command.fragments.arguments.length);
  }

  public checkOptionsKey(options: readonly string[]) {
    const unknownOptions = Object.keys(this.command.fragments.options).filter((name) => !options.includes(name));
    if (unknownOptions.length > 0) throw new CommandOptionUnexpectedError(unknownOptions);
  }
}
