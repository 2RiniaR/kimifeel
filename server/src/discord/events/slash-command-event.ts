import { CommandInteraction, GuildMember } from "discord.js";
import { Event } from "../event";
import { clientManager, targetGuildManager } from "../index";

export type SlashCommandEventContext = {
  interaction: CommandInteraction;
  member: GuildMember;
};

export class SlashCommandEvent extends Event<SlashCommandEventContext> {
  commandName: string;
  subCommandName?: string;
  allowBot: boolean;

  constructor(commandName: string, subCommandName: string | undefined = undefined, allowBot = false) {
    super();
    this.commandName = commandName;
    this.subCommandName = subCommandName;
    this.allowBot = allowBot;
  }

  register(listener: (props: SlashCommandEventContext) => Promise<void>): void {
    clientManager.client.on("interactionCreate", async (interaction) => {
      if (
        !interaction.isCommand() ||
        interaction.commandName !== this.commandName ||
        (this.subCommandName && interaction.options.getSubcommand() !== this.subCommandName) ||
        !interaction.channel ||
        !interaction.channel.isText() ||
        (!this.allowBot && interaction.user.bot)
      )
        return;
      const requester = await targetGuildManager.getMember(interaction.user.id);
      if (!requester) return;
      await listener({ interaction, member: requester });
    });
  }
}
