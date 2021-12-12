import { SystemMessageType } from "../../views";

export class ActionError extends Error {
  public readonly messageType?: SystemMessageType;
  public readonly title?: string;

  public constructor(messageType?: SystemMessageType, title?: string) {
    super();
    this.messageType = messageType;
    this.title = title;
  }
}
