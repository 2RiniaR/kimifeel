import { RequestAction } from "../actions";
import { Reaction } from "../structures";
import {
  AcceptRequestCommunicator,
  DenyRequestCommunicator,
  CancelRequestCommunicator
} from "../communicators/add-reaction";
import { runAction } from "./base";

export type AddReactionTriggerOptions = {
  emojis: string[];
  allowBot: boolean;
  myMessageOnly: boolean;
};

export type AddReactionTriggerHandler = (reaction: Reaction) => PromiseLike<void>;

export interface AddReactionTrigger {
  onTrigger(handler: AddReactionTriggerHandler, options: AddReactionTriggerOptions): void;
}

export class AddReactionActionRouter {
  constructor(
    private readonly trigger: AddReactionTrigger,
    private readonly actions: {
      request: RequestAction;
    }
  ) {}

  public register() {
    this.trigger.onTrigger(
      runAction(AcceptRequestCommunicator, (c) => this.actions.request.accept(c)),
      {
        emojis: ["✅"],
        allowBot: false,
        myMessageOnly: true
      }
    );

    this.trigger.onTrigger(
      runAction(CancelRequestCommunicator, (c) => this.actions.request.cancel(c)),
      {
        emojis: ["⛔"],
        allowBot: false,
        myMessageOnly: true
      }
    );

    this.trigger.onTrigger(
      runAction(DenyRequestCommunicator, (c) => this.actions.request.deny(c)),
      {
        emojis: ["❌"],
        allowBot: false,
        myMessageOnly: true
      }
    );
  }
}
