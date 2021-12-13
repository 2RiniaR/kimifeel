import { getProfileMarkdown, ProfileMarkdownProps } from "./profile-markdown";
import { SystemMessageEmbed } from "./system-message-embed";

export type ProfileListEmbedProps = {
  profiles: ProfileMarkdownProps[];
};

export class ProfileListEmbed extends SystemMessageEmbed {
  public constructor(props: ProfileListEmbedProps) {
    super("info", "プロフィール一覧", props.profiles.map((element) => getProfileMarkdown(element)).join("\n"));
  }
}
