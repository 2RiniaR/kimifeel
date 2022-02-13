import { Message as RawMessage } from "discord.js";
import { UsersMention } from "../mention";
import { DiscordUserIdentity, Message, MessageReplyOptions, SystemMessage, SystemMessageRead } from "../../structures";
import { SystemMessageCreator, SystemMessageReader } from "./system-message";

export class MessageImpl implements Message {
  public readonly author: DiscordUserIdentity;

  public constructor(public readonly raw: RawMessage) {
    this.author = { id: raw.author.id };
  }

  public async reply(message: SystemMessage, options: MessageReplyOptions): Promise<void> {
    const card = await this.raw.reply({
      content: options.mentions ? new UsersMention(options.mentions).getContent() : undefined,
      embeds: [new SystemMessageCreator(message).create()]
    });

    if (options.reactions) {
      await Promise.all(options.reactions.map((emoji) => card.react(emoji)));
    }
  }

  public readSystemMessage(): SystemMessageRead {
    return new SystemMessageReader(this.raw.embeds[0]).read();
  }
}
