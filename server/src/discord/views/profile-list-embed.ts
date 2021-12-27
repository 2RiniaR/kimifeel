import { getProfileMarkdown, ProfileMarkdownProps } from "./profile-markdown";
import { SystemMessageEmbed } from "./system-message-embed";

export type ProfileListEmbedProps = {
  profiles: ProfileMarkdownProps[];
};

export class ProfileListEmbed extends SystemMessageEmbed {
  public constructor(props: ProfileListEmbedProps) {
    super("profile", "プロフィール", props.profiles.map((element) => getProfileMarkdown(element)).join("\n"));
  }
}
