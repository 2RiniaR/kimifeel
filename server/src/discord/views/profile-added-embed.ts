import { SystemMessageEmbed } from "./system-message-embed";
import { getProfileMarkdown, ProfileMarkdownProps } from "./get-profile-markdown";

export type ProfileAddedEmbedProps = {
  userName: string;
  userAvatarURL: string;
  profile: ProfileMarkdownProps;
};

export class ProfileAddedEmbed extends SystemMessageEmbed {
  public constructor({ profile, userName, userAvatarURL }: ProfileAddedEmbedProps) {
    super("succeed", "プロフィールを作成しました！", getProfileMarkdown(profile));
    this.setAuthor(userName, userAvatarURL);
  }
}
