import { Communicator, ReplyOptions } from "./communicator";
import { SystemMessage } from "./system-message";
import { mentionUsers } from "../views";
import { CommandInteraction, Message } from "discord.js";

export class SlashCommand implements Communicator<CommandInteraction> {
  public constructor(public readonly raw: CommandInteraction) {}

  public async reply(message: SystemMessage, options: ReplyOptions): Promise<void> {
    let mentions = undefined;
    if (options.mentions && options.mentions.length > 0) {
      mentions = mentionUsers(options.mentions);
    }

    const card = await this.raw.reply({
      content: mentions,
      embeds: [message.getEmbed()],
      fetchReply: true
    });
    if (!(card instanceof Message)) return;

    if (options.reactions) {
      await options.reactions.mapAsync((emoji) => card.react(emoji));
    }
  }

  public getInteger(name: string, required: boolean) {
    return this.raw.options.getInteger(name, required) ?? undefined;
  }

  public getString(name: string, required: boolean) {
    return this.raw.options.getString(name, required) ?? undefined;
  }

  public getBoolean(name: string, required: boolean) {
    return this.raw.options.getBoolean(name, required) ?? undefined;
  }

  public getUser(name: string, required: boolean) {
    return this.raw.options.getUser(name, required) ?? undefined;
  }
}
