import { SystemMessageEmbed } from "./system-message-embed";
import { getProfileMarkdown, ProfileMarkdownProps } from "./get-profile-markdown";

export type RequestAcceptedEmbedProps = {
  userName: string;
  userAvatarURL: string;
  profile: ProfileMarkdownProps;
};

export class RequestAcceptedEmbed extends SystemMessageEmbed {
  public constructor({ profile, userName, userAvatarURL }: RequestAcceptedEmbedProps) {
    super("succeed", "リクエストが承認されました！", getProfileMarkdown(profile));
    this.setAuthor(userName, userAvatarURL);
  }
}
