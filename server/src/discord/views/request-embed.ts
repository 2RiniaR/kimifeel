import { MessageEmbed } from "discord.js";
import { getUserReference } from "../utils/get-user-reference";

export type RequestEmbedProps = {
  index: number;
  requesterUserName: string;
  requesterUserAvatarURL: string;
  requesterUserId: string;
  content: string;
  targetUserName: string;
  targetUserId: string;
};

export class RequestEmbed extends MessageEmbed {
  public constructor(props: RequestEmbedProps) {
    super();
    this.setAuthor(props.requesterUserName, props.requesterUserAvatarURL)
      .setDescription(RequestEmbed.buildDescription(props))
      .setColor("AQUA")
      .addField("No.", props.index.toString(), true);
  }

  public static getIndex(embed: MessageEmbed): number {
    const indexField = embed.fields.find((field) => field.name === "No.");
    if (!indexField) throw Error("Index field in the embed didn't exist.");
    return parseInt(indexField.value);
  }

  private static buildDescription(props: RequestEmbedProps): string {
    const content = `\`\`\`\n${props.content}\n\`\`\``;
    const messageForTarget = `${getUserReference(
      props.targetUserId
    )}\n承認→✅のリアクションを付ける\n拒否→❌のリアクションを付ける`;
    const messageForRequester = `${getUserReference(props.requesterUserId)}\n取り消し→⛔のリアクションを付ける`;
    return [content, messageForTarget, messageForRequester].join("\n");
  }
}
