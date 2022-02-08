import { ReplyOptions } from "./communicator";
import { SystemMessage } from "./system-message";
import { CommandInteraction, Message, User } from "discord.js";
import { UsersMention } from "../views/mention";

export class SlashCommand {
  public constructor(public readonly raw: CommandInteraction) {}

  public async reply(message: SystemMessage, options: ReplyOptions): Promise<void> {
    const card = await this.raw.reply({
      content: options.mentions ? new UsersMention(options.mentions).getContent() : undefined,
      embeds: [message.getEmbed()],
      fetchReply: true,
      ephemeral: options.showOnlySender
    });
    if (!(card instanceof Message)) return;

    if (options.reactions) {
      await options.reactions.mapAsync((emoji) => card.react(emoji));
    }
  }

  public getInteger(name: string): number {
    return this.raw.options.getInteger(name, true);
  }

  public getIntegerOptional(name: string): number | undefined {
    return this.raw.options.getInteger(name, false) ?? undefined;
  }

  public getString(name: string): string {
    return this.raw.options.getString(name, true);
  }

  public getStringOptional(name: string): string | undefined {
    return this.raw.options.getString(name, false) ?? undefined;
  }

  public getBoolean(name: string): boolean {
    return this.raw.options.getBoolean(name, true);
  }

  public getBooleanOptional(name: string): boolean | undefined {
    return this.raw.options.getBoolean(name) ?? undefined;
  }

  public getUser(name: string): User {
    return this.raw.options.getUser(name, true);
  }

  public getUserOptional(name: string): User | undefined {
    return this.raw.options.getUser(name, false) ?? undefined;
  }
}
