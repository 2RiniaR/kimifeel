import { SystemMessageEmbed } from "./system-message-embed";

export class RequestDeniedEmbed extends SystemMessageEmbed {
  public constructor() {
    super("failed", "リクエストが拒否されました。");
  }
}
