import { SystemMessageType } from "../views";

export class ActionError extends Error {
  public readonly messageType?: SystemMessageType;

  public constructor(messageType?: SystemMessageType) {
    super();
    this.messageType = messageType;
  }
}
