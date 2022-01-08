import { InteractionEventRunner } from "discord/events";
import { Endpoints } from "../endpoints";
import { DeleteProfileAction, RandomProfileAction, SearchProfileAction, ShowProfileAction } from "./profile";
import {
  AcceptRequestAction,
  CancelRequestAction,
  DenyRequestAction,
  SearchRequestAction,
  SendRequestAction,
  ShowRequestAction
} from "./request";
import { RegisterUserAction } from "./user";

export class InteractionRouter {
  private readonly event: InteractionEventRunner;
  private readonly endpoints: Endpoints;

  constructor(event: InteractionEventRunner, endpoints: Endpoints) {
    this.event = event;
    this.endpoints = endpoints;
  }

  public registerActions() {
    this.event.registerCreateCommandEvent(new DeleteProfileAction(this.endpoints.profile), {
      commandName: "profile",
      subCommandName: "delete",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new RandomProfileAction(this.endpoints.profile), {
      commandName: "profile",
      subCommandName: "random",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new SearchProfileAction(this.endpoints.profile), {
      commandName: "profile",
      subCommandName: "search",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new ShowProfileAction(this.endpoints.profile), {
      commandName: "profile",
      subCommandName: "show",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new AcceptRequestAction(this.endpoints.request), {
      commandName: "request",
      subCommandName: "accept",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new CancelRequestAction(this.endpoints.request), {
      commandName: "request",
      subCommandName: "cancel",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new DenyRequestAction(this.endpoints.request), {
      commandName: "request",
      subCommandName: "deny",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new SearchRequestAction(this.endpoints.request), {
      commandName: "request",
      subCommandName: "search",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new SendRequestAction(this.endpoints.request), {
      commandName: "request",
      subCommandName: "send",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new ShowRequestAction(this.endpoints.request), {
      commandName: "request",
      subCommandName: "show",
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new RegisterUserAction(this.endpoints.user), {
      commandName: "user",
      subCommandName: "register",
      allowBot: false
    });
  }
}
