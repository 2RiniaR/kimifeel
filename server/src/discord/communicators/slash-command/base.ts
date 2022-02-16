import { DiscordUserIdentity, SlashCommand, SystemMessage } from "../../structures";
import { Communicator, ReplyOptions } from "../../actions";

export abstract class SlashCommandCommunicator<T = void> implements Communicator<T> {
  public constructor(public readonly command: SlashCommand) {}

  public abstract getProps(): T;

  public getSender(): DiscordUserIdentity {
    return this.command.sender;
  }

  public reply(message: SystemMessage, options: ReplyOptions = {}) {
    return this.command.reply(message, options);
  }
}
