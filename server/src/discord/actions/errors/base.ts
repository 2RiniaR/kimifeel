import { CustomMessageType } from "../../views";

export class ActionError extends Error {
  public readonly messageType?: CustomMessageType;
  public readonly title?: string;

  public constructor(messageType?: CustomMessageType, title?: string) {
    super();
    this.messageType = messageType;
    this.title = title;
  }
}
