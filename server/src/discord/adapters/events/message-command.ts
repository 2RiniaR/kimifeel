import { Message as RawMessage } from "discord.js";
import { ClientImpl, MessageImpl } from "../structures";
import {
  MessageCommandParseFailedHandler,
  MessageCommandParseFailedOptions,
  MessageCommandTrigger,
  MessageCommandTriggerHandler,
  MessageCommandTriggerOptions
} from "../../routers";
import { MessageCommand } from "../../structures";
import { CommandFragments, CommandParser, FragmentLimitError, SyntaxError } from "command-parser";

type TriggerRegistration = {
  handler: MessageCommandTriggerHandler;
  options: MessageCommandTriggerOptions;
};

type ParseFailedRegistration = {
  handler: MessageCommandParseFailedHandler;
  options: MessageCommandParseFailedOptions;
};

export class MessageCommandEventProvider implements MessageCommandTrigger {
  private readonly triggerRegistrations: TriggerRegistration[] = [];
  private readonly parseFailedRegistrations: ParseFailedRegistration[] = [];

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
    this.triggerRegistrations.push({ handler, options });
  }

  public onParseFailed(handler: MessageCommandParseFailedHandler, options: MessageCommandParseFailedOptions) {
    this.parseFailedRegistrations.push({ handler, options });
  }

  private async onMessageCreated(rawMessage: RawMessage) {
    const registrations = this.triggerRegistrations.filter((registration) =>
      this.checkBot(rawMessage, registration.options.allowBot)
    );

    await Promise.all(
      registrations.map(async (registration) => {
        let fragments: CommandFragments | undefined;
        try {
          fragments = new CommandParser(rawMessage.content, registration.options.prefixes).parse();
        } catch (error) {
          if (error instanceof FragmentLimitError || error instanceof SyntaxError) {
            await this.runParseFailedEvents(rawMessage);
          }
          return;
        }

        if (fragments === undefined) return;
        const messageCommand: MessageCommand = { message: new MessageImpl(rawMessage), fragments };
        await registration.handler(messageCommand);
      })
    );
  }

  private async runParseFailedEvents(rawMessage: RawMessage) {
    const registrations = this.parseFailedRegistrations.filter((registration) =>
      this.checkBot(rawMessage, registration.options.allowBot)
    );
    await Promise.all(registrations.map(async (registration) => registration.handler(new MessageImpl(rawMessage))));
  }

  private checkBot(message: RawMessage, allowBot: boolean): boolean {
    return !message.author.bot || allowBot;
  }
}
