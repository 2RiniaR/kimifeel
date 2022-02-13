import { ErrorAction, ProfileAction, RequestAction, UserAction, HelpAction } from "../actions";
import { SlashCommand } from "../structures";
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
} from "../communicators/slash-command";
import { runAction } from "./base";

export type SlashCommandTriggerOptions = {
  commandName: string;
  subCommandGroupName?: string;
  subCommandName?: string;
  allowBot: boolean;
};

export type SlashCommandTriggerHandler = (reaction: SlashCommand) => PromiseLike<void>;

export interface SlashCommandTrigger {
  onTrigger(handler: SlashCommandTriggerHandler, options: SlashCommandTriggerOptions): void;
}

export class SlashCommandActionRouter {
  constructor(
    private readonly trigger: SlashCommandTrigger,
    private readonly actions: {
      profile: ProfileAction;
      request: RequestAction;
      user: UserAction;
      help: HelpAction;
    }
  ) {}

  public register() {
    this.trigger.onTrigger(
      runAction(HelpCommunicator, (c) => this.actions.help.show(c)),
      {
        commandName: "help",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(CreateProfileCommunicator, (c) => this.actions.profile.create(c)),
      {
        commandName: "profile",
        subCommandName: "create",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(DeleteProfileCommunicator, (c) => this.actions.profile.delete(c)),
      {
        commandName: "profile",
        subCommandName: "delete",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(RandomProfileCommunicator, (c) => this.actions.profile.random(c)),
      {
        commandName: "profile",
        subCommandName: "random",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(SearchProfileCommunicator, (c) => this.actions.profile.search(c)),
      {
        commandName: "profile",
        subCommandName: "search",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(ShowProfileCommunicator, (c) => this.actions.profile.show(c)),
      {
        commandName: "profile",
        subCommandName: "show",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(AcceptRequestCommunicator, (c) => this.actions.request.accept(c)),
      {
        commandName: "request",
        subCommandName: "accept",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(CancelRequestCommunicator, (c) => this.actions.request.cancel(c)),
      {
        commandName: "request",
        subCommandName: "cancel",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(DenyRequestCommunicator, (c) => this.actions.request.deny(c)),
      {
        commandName: "request",
        subCommandName: "deny",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(SearchRequestCommunicator, (c) => this.actions.request.search(c)),
      {
        commandName: "request",
        subCommandName: "search",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(SendRequestCommunicator, (c) => this.actions.request.send(c)),
      {
        commandName: "request",
        subCommandName: "send",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(ShowRequestCommunicator, (c) => this.actions.request.show(c)),
      {
        commandName: "request",
        subCommandName: "show",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(RegisterUserCommunicator, (c) => this.actions.user.register(c)),
      {
        commandName: "user",
        subCommandName: "register",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(ShowUserStatsCommunicator, (c) => this.actions.user.showStats(c)),
      {
        commandName: "user",
        subCommandName: "stats",
        allowBot: false
      }
    );

    this.trigger.onTrigger(
      runAction(ConfigUserCommunicator, (c) => this.actions.user.config(c)),
      {
        commandName: "user",
        subCommandName: "config",
        allowBot: false
      }
    );
  }
}
