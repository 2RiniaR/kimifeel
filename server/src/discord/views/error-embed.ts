import { ActionError } from "../errors";
import { SystemMessageEmbed } from "./system-message-embed";

export class ErrorEmbed extends SystemMessageEmbed {
  constructor(error: unknown) {
    if (error instanceof ActionError) {
      super(error.messageType ?? "error", error.title, error.message);
    } else if (error instanceof Error) {
      super("error", "不明なエラー", error.message);
    } else {
      super("error", "不明なエラー", "詳細な情報はありません。");
    }
  }
}
