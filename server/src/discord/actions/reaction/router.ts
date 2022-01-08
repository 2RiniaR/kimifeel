import { Endpoints } from "../endpoints";
import { RequestAction } from "./request";
import { ReactionEventRunner } from "discord/events/reaction";

export class ReactionRouter {
  private readonly event: ReactionEventRunner;
  private readonly endpoints: Endpoints;

  constructor(event: ReactionEventRunner, endpoints: Endpoints) {
    this.event = event;
    this.endpoints = endpoints;
  }

  public registerActions() {
    const actions = {
      request: new RequestAction(this.endpoints.request)
    } as const;

    this.event.registerAddEvent((reaction, user) => actions.request.accept(reaction, user), {
      emojis: ["✅"],
      allowBot: false,
      myMessageOnly: true
    });

    this.event.registerAddEvent((reaction, user) => actions.request.cancel(reaction, user), {
      emojis: ["⛔"],
      allowBot: false,
      myMessageOnly: true
    });

    this.event.registerAddEvent((reaction, user) => actions.request.deny(reaction, user), {
      emojis: ["❌"],
      allowBot: false,
      myMessageOnly: true
    });
  }
}
