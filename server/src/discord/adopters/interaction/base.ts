import { Communicator, ReplyOptions, SlashCommand, SystemMessage } from "../../structures";

export abstract class SlashCommandCommunicator<T = void> implements Communicator<T> {
  protected constructor(public readonly command: SlashCommand) {}

  public abstract getProps(): T;

  public getSenderId(): string {
    return this.command.raw.user.id;
  }

  public reply(message: SystemMessage, options: ReplyOptions = {}) {
    return this.command.reply(message, options);
  }
}
