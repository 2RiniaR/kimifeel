import { CustomMessageEmbed } from "./base";
import { ProfileProps, toProfileUnit } from "./profile";
import { MessageEmbed } from "discord.js";
import { removeMention, toMention } from "./user";

export type RequestProps = {
  index: number;
  content: string;
  requesterUserId: string;
  targetUserId: string;
};

export function toRequestUnit(
  { index, content, requesterUserId, targetUserId }: RequestProps,
  showDetail = true
): string {
  if (showDetail) {
    return `**${toMention(targetUserId)} No.${index}** - *by ${toMention(requesterUserId)}*\`\`\`\n${content}\n\`\`\``;
  } else {
    return `**${toMention(targetUserId)} No.${index}** - *by ${toMention(requesterUserId)}*`;
  }
}

export class RequestAcceptedEmbed extends CustomMessageEmbed {
  public constructor(profile: ProfileProps) {
    super("succeed", "リクエストが承認されました！", toProfileUnit(profile));
  }
}

export class RequestCanceledEmbed extends CustomMessageEmbed {
  public constructor(request: RequestProps) {
    super("failed", "リクエストがキャンセルされました。", toRequestUnit(request, false));
  }
}

export class RequestDeniedEmbed extends CustomMessageEmbed {
  public constructor(request: RequestProps) {
    super("failed", "リクエストが拒否されました。", toRequestUnit(request, false));
  }
}

export class RequestListEmbed extends CustomMessageEmbed {
  public constructor(requests: RequestProps[]) {
    super("request", "リクエスト", requests.map((element) => toRequestUnit(element)).join("\n"));
  }
}

export type RequestSentEmbedProps = RequestProps & {
  requesterUserName: string;
  requesterUserAvatarURL: string;
  targetUserName: string;
};

export class RequestSentEmbed extends CustomMessageEmbed {
  public static readonly UserIdFieldName = "To";
  public static readonly IndexFieldName = "Request No.";

  public constructor(props: RequestSentEmbedProps) {
    super("request", "リクエストが作成されました！", RequestSentEmbed.buildDescription(props));
    this.setAuthor(props.requesterUserName, props.requesterUserAvatarURL)
      .addField(RequestSentEmbed.UserIdFieldName, toMention(props.targetUserId), true)
      .addField(RequestSentEmbed.IndexFieldName, props.index.toString(), true);
  }

  public static getUserId(embed: MessageEmbed): string | undefined {
    const indexField = embed.fields.find((field) => field.name === RequestSentEmbed.UserIdFieldName);
    if (!indexField) return;
    return removeMention(indexField.value);
  }

  public static getIndex(embed: MessageEmbed): number | undefined {
    const indexField = embed.fields.find((field) => field.name === RequestSentEmbed.IndexFieldName);
    if (!indexField) return;
    return parseInt(indexField.value);
  }

  private static buildDescription(props: RequestSentEmbedProps): string {
    const content = `\`\`\`\n${props.content}\n\`\`\``;
    const messageForTarget = `${toMention(
      props.targetUserId
    )}\n承認→✅のリアクションを付ける\n拒否→❌のリアクションを付ける`;
    const messageForRequester = `${toMention(props.requesterUserId)}\nキャンセル→⛔のリアクションを付ける`;
    return `${content}\n${messageForTarget}\n\n${messageForRequester}`;
  }
}
