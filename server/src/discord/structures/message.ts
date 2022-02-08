import { SystemMessage } from "./system-message";
import { Message as DiscordMessage } from "discord.js";
import { ReplyOptions } from "./communicator";
import { UsersMention } from "../views/mention";
import { CommandFragments } from "../../command-parser";

export class Message {
  public constructor(public readonly raw: DiscordMessage, public readonly fragments: CommandFragments) {}

  public async reply(message: SystemMessage, options: ReplyOptions): Promise<void> {
    const card = await this.raw.reply({
      content: options.mentions ? new UsersMention(options.mentions).getContent() : undefined,
      embeds: [message.getEmbed()]
    });

    if (options.reactions) {
      await options.reactions.mapAsync((emoji) => card.react(emoji));
    }
  }
}
