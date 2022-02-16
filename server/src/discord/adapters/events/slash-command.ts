import { CommandInteraction, Interaction } from "discord.js";
import { ClientImpl, SlashCommandImpl } from "../structures";
import { SlashCommandTrigger, SlashCommandTriggerHandler, SlashCommandTriggerOptions } from "../../routers";

type TriggerRegistration = {
  handler: SlashCommandTriggerHandler;
  options: SlashCommandTriggerOptions;
};

export class SlashCommandEventProvider implements SlashCommandTrigger {
  private readonly triggerRegistrations: TriggerRegistration[] = [];

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
    this.triggerRegistrations.push({ handler, options });
  }

  private async onInteractionCreated(interaction: Interaction) {
    if (interaction.isCommand()) {
      await this.onCommandCreated(interaction);
    }
  }

  private async onCommandCreated(command: CommandInteraction) {
    let registrations = this.triggerRegistrations.filter((registration) =>
      this.checkBot(command, registration.options.allowBot)
    );
    registrations = registrations.filter((registration) => this.checkCommandName(command, registration.options));

    const slashCommand = new SlashCommandImpl(command);
    await Promise.all(registrations.map(async (registration) => await registration.handler(slashCommand)));
  }

  private checkBot(interaction: Interaction, allowBot: boolean) {
    return !interaction.user.bot || allowBot;
  }

  private checkCommandName(interaction: CommandInteraction, options: SlashCommandTriggerOptions) {
    const mainValid = interaction.commandName === options.commandName;
    const subGroupValid = (interaction.options.getSubcommandGroup(false) ?? undefined) === options.subCommandGroupName;
    const subValid = (interaction.options.getSubcommand(false) ?? undefined) === options.subCommandName;

    return mainValid && subGroupValid && subValid;
  }
}
