import { GuildMember, Message } from "discord.js";
import { targetGuildManager } from "discord";
import { CommandFragments, fragmentCommand } from "command-parser";

export type CreateCommandEventContext = {
  readonly message: Message;
  readonly member: GuildMember;
  readonly command: CommandFragments;
};

export type CreateCommandEventOptions = {
  readonly prefixes: readonly string[];
  readonly allowBot: boolean;
};

export interface CreateCommandEventListener {
  onCommandCreated(context: CreateCommandEventContext): PromiseLike<void>;
}

type CreateCommandEventRegistration = {
  listener: CreateCommandEventListener;
  options: CreateCommandEventOptions;
};

export interface MessageEventProvider {
  onMessageCreated(handler: (message: Message) => PromiseLike<void>): void;
}

export class MessageEventRunner {
  private readonly registrations = {
    onCommandCreated: [] as CreateCommandEventRegistration[]
  };

  constructor(provider: MessageEventProvider) {
    provider.onMessageCreated((message) => this.onMessageCreated(message));
  }

  public registerCreateCommandEvent(listener: CreateCommandEventListener, options: CreateCommandEventOptions) {
    this.registrations.onCommandCreated.push({ listener, options });
  }

  private async onMessageCreated(message: Message) {
    const sessions = this.registrations.onCommandCreated
      .map((registration) => {
        const botCheckPassed = !message.author.bot || registration.options.allowBot;
        if (!botCheckPassed) {
          return;
        }

        const command = fragmentCommand(message.content, registration.options.prefixes);
        if (!command) {
          return;
        }

        return {
          registration,
          command
        };
      })
      .removeNone();

    if (sessions.length === 0) {
      return;
    }

    const member = await targetGuildManager.getMember(message.author.id);
    if (!member) {
      return;
    }

    await sessions.forEachAsync(async ({ registration, command }) => {
      const context = { member, message, command };
      await registration.listener.onCommandCreated(context);
    });
  }
}
