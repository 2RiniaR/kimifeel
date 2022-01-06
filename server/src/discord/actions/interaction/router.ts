import { InteractionEventRunner } from "../../events/interaction";
import { RegisterUserAction } from "./users/register";
import { AcceptRequestAction } from "./requests/accept";
import { CancelRequestAction } from "./requests/cancel";
import { DenyRequestAction } from "./requests/deny";
import { SendRequestAction } from "./requests/send";

export class InteractionRouter {
  private readonly event: InteractionEventRunner;

  constructor(event: InteractionEventRunner) {
    this.event = event;
  }

  public registerActions() {
    this.event.registerCreateMessageCommandEvent(new AcceptRequestAction(), {
      commandName: "request",
      subCommandName: "accept",
      allowBot: false
    });

    this.event.registerCreateMessageCommandEvent(new CancelRequestAction(), {
      commandName: "request",
      subCommandName: "cancel",
      allowBot: false
    });

    this.event.registerCreateMessageCommandEvent(new DenyRequestAction(), {
      commandName: "request",
      subCommandName: "deny",
      allowBot: false
    });

    this.event.registerCreateMessageCommandEvent(new SendRequestAction(), {
      commandName: "request",
      subCommandName: "send",
      allowBot: false
    });

    this.event.registerCreateMessageCommandEvent(new RegisterUserAction(), {
      commandName: "user",
      subCommandName: "register",
      allowBot: false
    });
  }
}
