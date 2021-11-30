import { ActionError } from "../errors";
import { SystemMessageEmbed, SystemMessageEmbedProps } from "./system-message-embed";

export class ErrorEmbed extends SystemMessageEmbed {
  constructor(error: unknown) {
    let embedProps: SystemMessageEmbedProps;
    if (error instanceof ActionError) {
      embedProps = { type: error.messageType ?? "error", message: error.message };
    } else if (error instanceof Error) {
      embedProps = { type: "error", message: error.message };
    } else {
      embedProps = { type: "error", message: "不明なエラーが発生しました。" };
    }
    super(embedProps);
  }
}
