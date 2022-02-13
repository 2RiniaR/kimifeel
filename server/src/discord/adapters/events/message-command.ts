import { Message as RawMessage } from "discord.js";
import { fragmentCommand } from "command-parser";
import { ClientImpl } from "../structures";
import { FragmentLimitError } from "command-parser/fragment";
import { MessageCommandTrigger, MessageCommandTriggerHandler, MessageCommandTriggerOptions } from "../../routers";
import { MessageCommandImpl } from "../structures";

type Registration = {
  handler: MessageCommandTriggerHandler;
  options: MessageCommandTriggerOptions;
};

export class MessageCommandEventProvider implements MessageCommandTrigger {
  private readonly registrations: Registration[] = [];

  constructor(client: ClientImpl) {
    client.onMessageCreated(async (message) => {
      try {
        await this.onMessageCreated(message);
      } catch (error) {
        console.error(error);
      }
    });
  }

  public onTrigger(handler: MessageCommandTriggerHandler, options: MessageCommandTriggerOptions) {
    this.registrations.push({ handler, options });
  }

  private async onMessageCreated(rawMessage: RawMessage) {
    const registrations = this.registrations.filter((registration) => this.checkBot(rawMessage, registration.options));

    await Promise.all(
      registrations.map(async (registration) => {
        let fragments;
        try {
          fragments = fragmentCommand(rawMessage.content, registration.options.prefixes);
        } catch (error) {
          if (error instanceof FragmentLimitError) return;
          throw error;
        }
        if (!fragments) return;

        const message = new MessageCommandImpl(rawMessage, fragments);
        await registration.handler(message);
      })
    );
  }

  private checkBot(message: RawMessage, options: MessageCommandTriggerOptions): boolean {
    return !message.author.bot || options.allowBot;
  }
}
