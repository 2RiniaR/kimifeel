import { MessageEmbed } from "discord.js";
import { getUserReference, removeUserReference } from "../utils/user-reference";

export type RequestEmbedProps = {
  index: number;
  requesterUserName: string;
  requesterUserAvatarURL: string;
  requesterUserId: string;
  content: string;
  targetUserName: string;
  targetUserId: string;
};

export class RequestSentEmbed extends MessageEmbed {
  public static readonly UserIdFieldName = "To";
  public static readonly IndexFieldName = "Request No.";

  public constructor(props: RequestEmbedProps) {
    super();
    this.setAuthor(props.requesterUserName, props.requesterUserAvatarURL)
      .setDescription(RequestSentEmbed.buildDescription(props))
      .setColor("AQUA")
      .addField(RequestSentEmbed.UserIdFieldName, getUserReference(props.targetUserId), true)
      .addField(RequestSentEmbed.IndexFieldName, props.index.toString(), true);
  }

  public static getUserId(embed: MessageEmbed): string | undefined {
    const indexField = embed.fields.find((field) => field.name === RequestSentEmbed.UserIdFieldName);
    if (!indexField) return;
    return removeUserReference(indexField.value);
  }

  public static getIndex(embed: MessageEmbed): number | undefined {
    const indexField = embed.fields.find((field) => field.name === RequestSentEmbed.IndexFieldName);
    if (!indexField) return;
    return parseInt(indexField.value);
  }

  private static buildDescription(props: RequestEmbedProps): string {
    const content = `\`\`\`\n${props.content}\n\`\`\``;
    const messageForTarget = `${getUserReference(
      props.targetUserId
    )}\n承認→✅のリアクションを付ける\n拒否→❌のリアクションを付ける`;
    const messageForRequester = `${getUserReference(props.requesterUserId)}\nキャンセル→⛔のリアクションを付ける`;
    return `${content}\n${messageForTarget}\n\n${messageForRequester}`;
  }
}
