import { Endpoints } from "../../actions/endpoints";
import { AcceptRequestAction, CancelRequestAction, DenyRequestAction } from "./request";
import { ReactionEventRunner } from "discord/events/reaction";

export class ReactionRouter {
  private readonly event: ReactionEventRunner;
  private readonly endpoints: Endpoints;

  constructor(event: ReactionEventRunner, endpoints: Endpoints) {
    this.event = event;
    this.endpoints = endpoints;
  }

  public registerActions() {
    this.event.registerAddEvent(new AcceptRequestAction(this.endpoints), {
      emojis: ["✅"],
      allowBot: false,
      myMessageOnly: true
    });

    this.event.registerAddEvent(new CancelRequestAction(this.endpoints), {
      emojis: ["⛔"],
      allowBot: false,
      myMessageOnly: true
    });

    this.event.registerAddEvent(new DenyRequestAction(this.endpoints), {
      emojis: ["❌"],
      allowBot: false,
      myMessageOnly: true
    });
  }
}
