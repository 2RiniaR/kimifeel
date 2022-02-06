import { SystemMessage } from "./system-message";
import { mentionUsers } from "../views";
import { Message as DiscordMessage } from "discord.js";
import { ReplyOptions } from "../runner/communicator";

export class MessageCommand {
  public constructor(public readonly raw: DiscordMessage) {}

  public async reply(message: SystemMessage, options: ReplyOptions): Promise<void> {
    let mentions = undefined;
    if (options.mentions && options.mentions.length > 0) {
      mentions = mentionUsers(options.mentions);
    }

    const card = await this.raw.reply({
      content: mentions,
      embeds: [message.getEmbed()]
    });

    if (options.reactions) {
      await options.reactions.mapAsync((emoji) => card.react(emoji));
    }
  }
}
