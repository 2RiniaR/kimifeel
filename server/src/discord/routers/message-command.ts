import { ProfileAction, RequestAction, UserAction, HelpAction, ErrorAction } from "../actions";
import { CommandParseFailedError, Message, MessageCommand } from "../structures";
import {
  AcceptRequestCommunicator,
  DenyRequestCommunicator,
  CancelRequestCommunicator,
  ConfigUserCommunicator,
  ShowUserStatsCommunicator,
  RegisterUserCommunicator,
  ShowRequestCommunicator,
  SendRequestCommunicator,
  SearchRequestCommunicator,
  ShowProfileCommunicator,
  SearchProfileCommunicator,
  RandomProfileCommunicator,
  DeleteProfileCommunicator,
  CreateProfileCommunicator,
  HelpCommunicator
} from "../communicators/message-command";
import { runAction } from "./base";
import { ParseFailedCommunicator } from "../communicators/message-command/parse-failed";

export type MessageCommandTriggerOptions = {
  readonly prefixes: readonly string[];
  readonly allowBot: boolean;
};

export type MessageCommandParseFailedOptions = {
  readonly allowBot: boolean;
};

export type MessageCommandTriggerHandler = (command: MessageCommand) => PromiseLike<void>;
export type MessageCommandParseFailedHandler = (message: Message) => PromiseLike<void>;

export interface MessageCommandTrigger {
  onTrigger(handler: MessageCommandTriggerHandler, options: MessageCommandTriggerOptions): void;
  onParseFailed(handler: MessageCommandParseFailedHandler, options: MessageCommandParseFailedOptions): void;
}

const basePhrase = "!kimi";

export class MessageCommandActionRouter {
  public constructor(
    private readonly trigger: MessageCommandTrigger,
    private readonly actions: {
      profile: ProfileAction;
      request: RequestAction;
      user: UserAction;
      help: HelpAction;
      error: ErrorAction;
    }
  ) {}

  public register() {
    // ここの対応方法が汚いのどうにかしたかった...
    this.trigger.onParseFailed(
      (message) =>
        this.actions.error
          .withErrorResponses(new ParseFailedCommunicator(message))
          .invokeAsync(() => Promise.reject(new CommandParseFailedError())),
      { allowBot: false }
    );

    this.trigger.onTrigger(
      runAction(HelpCommunicator, (c) => this.actions.help.show(c)),
      {
        prefixes: [`${basePhrase} help`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(CreateProfileCommunicator, (c) => this.actions.profile.create(c)),
      {
        prefixes: [`${basePhrase} profile create`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(DeleteProfileCommunicator, (c) => this.actions.profile.delete(c)),
      {
        prefixes: [`${basePhrase} profile delete`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(RandomProfileCommunicator, (c) => this.actions.profile.random(c)),
      {
        prefixes: [`${basePhrase} profile random`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(SearchProfileCommunicator, (c) => this.actions.profile.search(c)),
      {
        prefixes: [`${basePhrase} profile search`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(ShowProfileCommunicator, (c) => this.actions.profile.show(c)),
      {
        prefixes: [`${basePhrase} profile show`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(AcceptRequestCommunicator, (c) => this.actions.request.accept(c)),
      {
        prefixes: [`${basePhrase} request accept`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(CancelRequestCommunicator, (c) => this.actions.request.cancel(c)),
      {
        prefixes: [`${basePhrase} request cancel`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(DenyRequestCommunicator, (c) => this.actions.request.deny(c)),
      {
        prefixes: [`${basePhrase} request deny`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(SearchRequestCommunicator, (c) => this.actions.request.search(c)),
      {
        prefixes: [`${basePhrase} request search`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(SendRequestCommunicator, (c) => this.actions.request.send(c)),
      {
        prefixes: [`${basePhrase} request send`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(ShowRequestCommunicator, (c) => this.actions.request.show(c)),
      {
        prefixes: [`${basePhrase} request show`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(RegisterUserCommunicator, (c) => this.actions.user.register(c)),
      {
        prefixes: [`${basePhrase} user register`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(ShowUserStatsCommunicator, (c) => this.actions.user.showStats(c)),
      {
        prefixes: [`${basePhrase} user stats`],
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(ConfigUserCommunicator, (c) => this.actions.user.config(c)),
      {
        prefixes: [`${basePhrase} user config`],
        allowBot: false
      }
    );
  }
}
