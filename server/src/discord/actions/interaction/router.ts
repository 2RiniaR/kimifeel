import { InteractionEventRunner } from "discord/events";
import { Endpoints } from "../endpoints";
import {
  CreateProfileAction,
  DeleteProfileAction,
  RandomProfileAction,
  SearchProfileAction,
  ShowProfileAction
} from "./profile";
import {
  AcceptRequestAction,
  CancelRequestAction,
  DenyRequestAction,
  SearchRequestAction,
  SendRequestAction,
  ShowRequestAction
} from "./request";
import { ConfigUserAction, RegisterUserAction, ShowStatsUserAction } from "./user";
import { HelpAction } from "./help";

export class InteractionRouter {
  private readonly event: InteractionEventRunner;
  private readonly endpoints: Endpoints;

  constructor(event: InteractionEventRunner, endpoints: Endpoints) {
    this.event = event;
    this.endpoints = endpoints;
  }

  public registerActions() {
    this.event.registerCreateCommandEvent(new HelpAction(), {
      commandName: "help",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new CreateProfileAction(this.endpoints), {
      commandName: "profile",
      subCommandName: "create",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new DeleteProfileAction(this.endpoints), {
      commandName: "profile",
      subCommandName: "delete",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new RandomProfileAction(this.endpoints), {
      commandName: "profile",
      subCommandName: "random",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new SearchProfileAction(this.endpoints), {
      commandName: "profile",
      subCommandName: "search",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new ShowProfileAction(this.endpoints), {
      commandName: "profile",
      subCommandName: "show",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new AcceptRequestAction(this.endpoints), {
      commandName: "request",
      subCommandName: "accept",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new CancelRequestAction(this.endpoints), {
      commandName: "request",
      subCommandName: "cancel",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new DenyRequestAction(this.endpoints), {
      commandName: "request",
      subCommandName: "deny",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new SearchRequestAction(this.endpoints), {
      commandName: "request",
      subCommandName: "search",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new SendRequestAction(this.endpoints), {
      commandName: "request",
      subCommandName: "send",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new ShowRequestAction(this.endpoints), {
      commandName: "request",
      subCommandName: "show",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new RegisterUserAction(this.endpoints), {
      commandName: "user",
      subCommandName: "register",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new ShowStatsUserAction(this.endpoints), {
      commandName: "user",
      subCommandName: "stats",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new ConfigUserAction(this.endpoints), {
      commandName: "user",
      subCommandName: "config",
      allowBot: false
    });
  }
}
