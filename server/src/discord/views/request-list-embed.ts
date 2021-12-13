import { SystemMessageEmbed } from "./system-message-embed";
import { getRequestMarkdown, RequestMarkdownProps } from "./request-markdown";

export type RequestListEmbedProps = {
  requests: RequestMarkdownProps[];
};

export class RequestListEmbed extends SystemMessageEmbed {
  public constructor(props: RequestListEmbedProps) {
    super("info", "プロフィール一覧", props.requests.map((element) => getRequestMarkdown(element)).join("\n"));
  }
}
