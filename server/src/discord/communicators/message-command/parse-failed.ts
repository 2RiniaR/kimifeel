import { Communicator, ReplyOptions } from "../../actions";
import { DiscordUserIdentity, Message, SystemMessage } from "../../structures";

export class ParseFailedCommunicator implements Communicator {
  public constructor(public readonly message: Message) {}

  public getProps() {
    /* do nothing */
  }

  getSender(): DiscordUserIdentity {
    return this.message.author;
  }

  reply(message: SystemMessage, options: ReplyOptions = {}): PromiseLike<void> {
    return this.message.reply(message, options);
  }
}
