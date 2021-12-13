import { SystemMessageEmbed } from "./system-message-embed";
import { getRequestAbstractMarkdown, RequestMarkdownProps } from "./request-markdown";

export type RequestCanceledEmbedProps = {
  request: RequestMarkdownProps;
};

export class RequestCanceledEmbed extends SystemMessageEmbed {
  public constructor({ request }: RequestCanceledEmbedProps) {
    super("failed", "リクエストがキャンセルされました。", getRequestAbstractMarkdown(request));
  }
}
