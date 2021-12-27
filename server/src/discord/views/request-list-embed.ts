import { SystemMessageEmbed } from "./system-message-embed";
import { getRequestMarkdown, RequestMarkdownProps } from "./request-markdown";

export type RequestListEmbedProps = {
  requests: RequestMarkdownProps[];
};

export class RequestListEmbed extends SystemMessageEmbed {
  public constructor(props: RequestListEmbedProps) {
    super("request", "リクエスト", props.requests.map((element) => getRequestMarkdown(element)).join("\n"));
  }
}
