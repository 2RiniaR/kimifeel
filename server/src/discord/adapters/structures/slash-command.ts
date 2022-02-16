import { CommandInteraction, Message } from "discord.js";
import { UsersMention } from "../mention";
import { DiscordUserIdentity, SlashCommand, SlashCommandReplyOptions, SystemMessage } from "../../structures";
import { SystemMessageCreator } from "./system-message";

export class SlashCommandImpl implements SlashCommand {
  public readonly sender: DiscordUserIdentity;

  public constructor(public readonly raw: CommandInteraction) {
    this.sender = { id: raw.user.id };
  }

  public async reply(message: SystemMessage, options: SlashCommandReplyOptions): Promise<void> {
    const card = await this.raw.reply({
      content: options.mentions !== undefined ? new UsersMention(options.mentions).getContent() : undefined,
      embeds: [new SystemMessageCreator(message).create()],
      fetchReply: true,
      ephemeral: options.showOnlySender
    });
    if (!(card instanceof Message)) return;

    if (options.reactions) {
      await Promise.all(options.reactions.map((emoji) => card.react(emoji)));
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

  public getUser(name: string): DiscordUserIdentity {
    return this.raw.options.getUser(name, true);
  }

  public getUserOptional(name: string): DiscordUserIdentity | undefined {
    return this.raw.options.getUser(name, false) ?? undefined;
  }
}
