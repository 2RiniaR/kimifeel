import { SystemMessageEmbed } from "./system-message-embed";
import { getProfileMarkdown, ProfileMarkdownProps } from "./get-profile-markdown";

export type ProfileDeletedEmbedProps = {
  userName: string;
  userAvatarURL: string;
  profile: ProfileMarkdownProps;
};

export class ProfileDeletedEmbed extends SystemMessageEmbed {
  public constructor({ profile, userName, userAvatarURL }: ProfileDeletedEmbedProps) {
    super("deleted", "プロフィールを削除しました。", getProfileMarkdown(profile));
    this.setAuthor(userName, userAvatarURL);
  }
}
