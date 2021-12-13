import { SystemMessageEmbed } from "./system-message-embed";
import { getProfileMarkdown, ProfileMarkdownProps } from "./profile-markdown";

export type RequestAcceptedEmbedProps = {
  profile: ProfileMarkdownProps;
};

export class RequestAcceptedEmbed extends SystemMessageEmbed {
  public constructor({ profile }: RequestAcceptedEmbedProps) {
    super("succeed", "リクエストが承認されました！", getProfileMarkdown(profile));
  }
}
