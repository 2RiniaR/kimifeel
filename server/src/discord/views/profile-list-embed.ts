import { MessageEmbed } from "discord.js";

export type ProfileListEmbedProps = {
  targetName: string;
  targetAvatarURL: string;
  elements: ProfileListElement[];
};

export type ProfileListElement = {
  index: number;
  content: string;
  author: string;
};

export class ProfileListEmbed extends MessageEmbed {
  public constructor(props: ProfileListEmbedProps) {
    super();
    this.setColor("GREEN")
      .setTitle("プロフィール")
      .setAuthor(props.targetName, props.targetAvatarURL)
      .setDescription(props.elements.map((element) => ProfileListEmbed.stringifyElement(element)).join("\n"));
  }

  private static stringifyElement({ index, content, author }: ProfileListElement): string {
    return `No.${index}    ✒ ${author}\`\`\`\n${content}\n\`\`\``;
  }
}