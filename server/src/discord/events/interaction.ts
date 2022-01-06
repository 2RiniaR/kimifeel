import { CommandInteraction, GuildMember, Interaction, User } from "discord.js";
import { targetGuildManager } from "../index";

export type CreateMessageCommandEventContext = {
  interaction: CommandInteraction;
  member: GuildMember;
};

export type CreateMessageCommandEventOptions = {
  commandName: string;
  subCommandGroupName?: string;
  subCommandName?: string;
  allowBot: boolean;
};

export interface CreateMessageCommandEventListener {
  onMessageCommandCreated(context: CreateMessageCommandEventContext): PromiseLike<void>;
}

type CreateMessageCommandEventRegistration = {
  listener: CreateMessageCommandEventListener;
  options: CreateMessageCommandEventOptions;
};

export interface InteractionEventProvider {
  onInteractionCreated(handler: (interaction: Interaction, user: User) => PromiseLike<void>): void;
}

export class InteractionEventRunner {
  private readonly registrations = {
    onMessageCommandCreated: [] as CreateMessageCommandEventRegistration[]
  };

  constructor(provider: InteractionEventProvider) {
    provider.onInteractionCreated((interaction) => this.onInteractionCreated(interaction));
  }

  public registerCreateMessageCommandEvent(
    listener: CreateMessageCommandEventListener,
    options: CreateMessageCommandEventOptions
  ) {
    this.registrations.onMessageCommandCreated.push({ listener, options });
  }

  private async onInteractionCreated(interaction: Interaction) {
    if (!interaction.isCommand()) {
      return;
    }

    const registrations = this.registrations.onMessageCommandCreated.filter(
      (registration) =>
        this.checkCommandName(interaction, registration.options) && this.checkBot(interaction, registration.options)
    );

    const member = await targetGuildManager.getMember(interaction.user.id);
    if (!member) {
      return;
    }

    const context = { interaction, member };
    await registrations.mapAsync(async (registration) => await registration.listener.onMessageCommandCreated(context));
  }

  private checkCommandName(interaction: CommandInteraction, options: CreateMessageCommandEventOptions) {
    const mainValid = interaction.commandName === options.commandName;
    const subGroupValid = (interaction.options.getSubcommandGroup(false) ?? undefined) === options.subCommandGroupName;
    const subValid = (interaction.options.getSubcommand(false) ?? undefined) === options.subCommandName;

    return mainValid && subGroupValid && subValid;
  }

  private checkBot(interaction: CommandInteraction, options: CreateMessageCommandEventOptions) {
    return options.allowBot || !interaction.user.bot;
  }
}
