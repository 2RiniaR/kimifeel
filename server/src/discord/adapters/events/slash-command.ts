import { CommandInteraction, Interaction } from "discord.js";
import { ClientImpl, SlashCommandImpl } from "../structures";
import { SlashCommandTrigger, SlashCommandTriggerHandler, SlashCommandTriggerOptions } from "../../routers";

type Registration = {
  handler: SlashCommandTriggerHandler;
  options: SlashCommandTriggerOptions;
};

export class SlashCommandEventProvider implements SlashCommandTrigger {
  private readonly registrations: Registration[] = [];

  constructor(client: ClientImpl) {
    client.onInteractionCreated(async (interaction) => {
      try {
        await this.onInteractionCreated(interaction);
      } catch (error) {
        console.error(error);
      }
    });
  }

  public onTrigger(handler: SlashCommandTriggerHandler, options: SlashCommandTriggerOptions) {
    this.registrations.push({ handler, options });
  }

  private async onInteractionCreated(interaction: Interaction) {
    if (interaction.isCommand()) {
      await this.onCommandCreated(interaction);
    }
  }

  private async onCommandCreated(command: CommandInteraction) {
    let registrations = this.registrations.filter((registration) => this.checkBot(command, registration.options));
    registrations = registrations.filter((registration) => this.checkCommandName(command, registration.options));

    const slashCommand = new SlashCommandImpl(command);
    await Promise.all(registrations.map(async (registration) => await registration.handler(slashCommand)));
  }

  private checkBot(interaction: Interaction, options: SlashCommandTriggerOptions) {
    return options.allowBot || !interaction.user.bot;
  }

  private checkCommandName(interaction: CommandInteraction, options: SlashCommandTriggerOptions) {
    const mainValid = interaction.commandName === options.commandName;
    const subGroupValid = (interaction.options.getSubcommandGroup(false) ?? undefined) === options.subCommandGroupName;
    const subValid = (interaction.options.getSubcommand(false) ?? undefined) === options.subCommandName;

    return mainValid && subGroupValid && subValid;
  }
}
