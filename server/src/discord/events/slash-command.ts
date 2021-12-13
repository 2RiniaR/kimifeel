import { CommandInteraction, GuildMember } from "discord.js";
import { Event } from "./base";
import { clientManager, targetGuildManager } from "../index";

export type SlashCommandEventContext = {
  interaction: CommandInteraction;
  member: GuildMember;
};

export type SlashCommandEventOptions = {
  commandName: string;
  subCommandGroupName?: string;
  subCommandName?: string;
  allowBot: boolean;
};

function checkCommandName(interaction: CommandInteraction, options: SlashCommandEventOptions) {
  const mainValid = interaction.commandName === options.commandName;
  const subGroupValid = interaction.options.getSubcommandGroup() === options.subCommandGroupName;
  const subValid = interaction.options.getSubcommand() === options.subCommandName;
  return mainValid && subGroupValid && subValid;
}

function checkBot(interaction: CommandInteraction, options: SlashCommandEventOptions) {
  return options.allowBot || !interaction.user.bot;
}

export class SlashCommandEvent extends Event<SlashCommandEventContext, SlashCommandEventOptions> {
  public activate() {
    clientManager.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;
      const listeners = this.listeners.filter(
        (listener) => checkCommandName(interaction, listener.options) && checkBot(interaction, listener.options)
      );
      const member = await targetGuildManager.getMember(interaction.user.id);
      if (!member) return;

      const context: SlashCommandEventContext = { interaction, member };
      await listeners.mapAsync((listener) => listener.onEvent(context));
    });
  }
}
