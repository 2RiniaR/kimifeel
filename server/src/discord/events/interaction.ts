import { CommandInteraction, Interaction } from "discord.js";
import { ClientManager } from "../client";
import { SlashCommand } from "../structures";

export type CreateCommandEventOptions = {
  commandName: string;
  subCommandGroupName?: string;
  subCommandName?: string;
  allowBot: boolean;
};

export interface CreateCommandEventListener {
  onCommandCreated(command: SlashCommand): PromiseLike<void>;
}

type CreateCommandEventRegistration = {
  listener: CreateCommandEventListener;
  options: CreateCommandEventOptions;
};

export class InteractionEventRunner {
  private readonly registrations = {
    onCommandCreated: [] as CreateCommandEventRegistration[]
  };

  constructor(client: ClientManager) {
    client.onInteractionCreated(async (interaction) => {
      try {
        await this.onInteractionCreated(interaction);
      } catch (error) {
        console.error(error);
      }
    });
  }

  public registerCreateCommandEvent(listener: CreateCommandEventListener, options: CreateCommandEventOptions) {
    this.registrations.onCommandCreated.push({ listener, options });
  }

  private async onInteractionCreated(interaction: Interaction) {
    if (interaction.isCommand()) {
      await this.onCommandCreated(interaction);
    }
  }

  private async onCommandCreated(command: CommandInteraction) {
    let registrations = this.registrations.onCommandCreated;

    registrations = registrations.filter((registration) => this.checkBot(command, registration.options));
    registrations = registrations.filter((registration) => this.checkCommandName(command, registration.options));

    const slashCommand = new SlashCommand(command);
    await registrations.mapAsync(async (registration) => await registration.listener.onCommandCreated(slashCommand));
  }

  private checkBot(interaction: Interaction, options: CreateCommandEventOptions) {
    return options.allowBot || !interaction.user.bot;
  }

  private checkCommandName(interaction: CommandInteraction, options: CreateCommandEventOptions) {
    const mainValid = interaction.commandName === options.commandName;
    const subGroupValid = (interaction.options.getSubcommandGroup(false) ?? undefined) === options.subCommandGroupName;
    const subValid = (interaction.options.getSubcommand(false) ?? undefined) === options.subCommandName;

    return mainValid && subGroupValid && subValid;
  }
}
