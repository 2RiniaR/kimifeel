import { SystemMessageEmbed } from "./system-message-embed";
import { getProfileAbstractMarkdown, ProfileMarkdownProps } from "./profile-markdown";

export type ProfileDeletedEmbedProps = {
  profile: ProfileMarkdownProps;
};

export class ProfileDeletedEmbed extends SystemMessageEmbed {
  public constructor({ profile }: ProfileDeletedEmbedProps) {
    super("deleted", "プロフィールを削除しました。", getProfileAbstractMarkdown(profile));
  }
}
