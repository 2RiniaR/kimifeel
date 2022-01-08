import { Message } from "discord.js";
import { CommandFragments, fragmentCommand } from "command-parser";
import { ClientManager } from "../client";

export type CreateCommandEventOptions = {
  readonly prefixes: readonly string[];
  readonly allowBot: boolean;
};

export interface CreateCommandEventListener {
  onCommandCreated(message: Message, command: CommandFragments): PromiseLike<void>;
}

type CreateCommandEventRegistration = {
  listener: CreateCommandEventListener;
  options: CreateCommandEventOptions;
};

export class MessageEventRunner {
  private readonly registrations = {
    onCommandCreated: [] as CreateCommandEventRegistration[]
  };

  constructor(client: ClientManager) {
    client.onMessageCreated((message) => this.onMessageCreated(message));
  }

  public registerCreateCommandEvent(listener: CreateCommandEventListener, options: CreateCommandEventOptions) {
    this.registrations.onCommandCreated.push({ listener, options });
  }

  private async onMessageCreated(message: Message) {
    let registrations = this.registrations.onCommandCreated;

    registrations = registrations.filter((registration) => this.checkBot(message, registration.options));

    await registrations.forEachAsync(async (registration) => {
      const command = fragmentCommand(message.content, registration.options.prefixes);
      if (command) await registration.listener.onCommandCreated(message, command);
    });
  }

  private checkBot(message: Message, options: CreateCommandEventOptions) {
    return !message.author.bot || options.allowBot;
  }
}
