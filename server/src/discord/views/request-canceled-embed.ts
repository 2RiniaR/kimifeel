import { SystemMessageEmbed } from "./system-message-embed";

export class RequestCanceledEmbed extends SystemMessageEmbed {
  public constructor() {
    super("failed", "リクエストがキャンセルされました。");
  }
}
