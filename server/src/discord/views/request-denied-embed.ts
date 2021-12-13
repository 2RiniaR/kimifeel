import { SystemMessageEmbed } from "./system-message-embed";
import { getRequestAbstractMarkdown, RequestMarkdownProps } from "./request-markdown";

export type RequestDeniedEmbedProps = {
  request: RequestMarkdownProps;
};

export class RequestDeniedEmbed extends SystemMessageEmbed {
  public constructor({ request }: RequestDeniedEmbedProps) {
    super("failed", "リクエストが拒否されました。", getRequestAbstractMarkdown(request));
  }
}
