import { getProfileMarkdown, ProfileMarkdownProps } from "./get-profile-markdown";
import { SystemMessageEmbed } from "./system-message-embed";

export type ProfileListEmbedProps = {
  targetName: string;
  targetAvatarURL: string;
  elements: ProfileMarkdownProps[];
};

export class ProfileListEmbed extends SystemMessageEmbed {
  public constructor(props: ProfileListEmbedProps) {
    super("info", "プロフィール一覧", props.elements.map((element) => getProfileMarkdown(element)).join("\n"));
    this.setAuthor(props.targetName, props.targetAvatarURL);
  }
}
