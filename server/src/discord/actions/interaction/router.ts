import { InteractionEventRunner } from "discord/events";
import { Endpoints } from "../endpoints";
import { ProfileAction } from "./profile";
import { RequestAction } from "./request";
import { UserAction } from "./user";

export class InteractionRouter {
  private readonly event: InteractionEventRunner;
  private readonly endpoints: Endpoints;

  constructor(event: InteractionEventRunner, endpoints: Endpoints) {
    this.event = event;
    this.endpoints = endpoints;
  }

  public registerActions() {
    const actions = {
      profile: new ProfileAction(this.endpoints.profile),
      request: new RequestAction(this.endpoints.request),
      user: new UserAction(this.endpoints.user)
    } as const;

    this.event.registerCreateEvent((command) => actions.profile.delete(command), {
      commandName: "profile",
      subCommandName: "delete",
      allowBot: false
    });

    this.event.registerCreateEvent((command) => actions.profile.random(command), {
      commandName: "profile",
      subCommandName: "random",
      allowBot: false
    });

    this.event.registerCreateEvent((command) => actions.profile.search(command), {
      commandName: "profile",
      subCommandName: "search",
      allowBot: false
    });

    this.event.registerCreateEvent((command) => actions.profile.show(command), {
      commandName: "profile",
      subCommandName: "show",
      allowBot: false
    });

    this.event.registerCreateEvent((command) => actions.request.accept(command), {
      commandName: "request",
      subCommandName: "accept",
      allowBot: false
    });

    this.event.registerCreateEvent((command) => actions.request.cancel(command), {
      commandName: "request",
      subCommandName: "cancel",
      allowBot: false
    });

    this.event.registerCreateEvent((command) => actions.request.deny(command), {
      commandName: "request",
      subCommandName: "deny",
      allowBot: false
    });

    this.event.registerCreateEvent((command) => actions.request.search(command), {
      commandName: "request",
      subCommandName: "search",
      allowBot: false
    });

    this.event.registerCreateEvent((command) => actions.request.send(command), {
      commandName: "request",
      subCommandName: "send",
      allowBot: false
    });

    this.event.registerCreateEvent((command) => actions.request.show(command), {
      commandName: "request",
      subCommandName: "show",
      allowBot: false
    });

    this.event.registerCreateEvent((command) => actions.user.register(command), {
      commandName: "user",
      subCommandName: "register",
      allowBot: false
    });
  }
}
