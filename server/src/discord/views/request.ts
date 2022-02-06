import { ProfileProps, toProfileUnit } from "./profile";
import { MessageEmbed } from "discord.js";
import { removeMention, toMention } from "./user";
import { RequestSpecifier } from "app/endpoints/structures";
import { SystemMessage } from "../structures";

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
    return `**No.${index}** ${toMention(targetUserId)}\`\`\`\n${content}\n\`\`\` ―――― *by ${toMention(
      requesterUserId
    )}*`;
  } else {
    return `**No.${index}** ${toMention(targetUserId)} ―――― *by ${toMention(requesterUserId)}*`;
  }
}

function getIdentityCall(specifier: RequestSpecifier) {
  if ("id" in specifier) return `リクエスト ID: \`${specifier.id}\``;
  else return `プロフィール 番号: \`${specifier.index}\``;
}

export class RequestAcceptedMessage extends SystemMessage {
  public constructor(profile: ProfileProps) {
    super();
    this.type = "succeed";
    this.title = "リクエストが承認されました！";
    this.message = toProfileUnit(profile);
  }
}

export class RequestCanceledMessage extends SystemMessage {
  public constructor(request: RequestProps) {
    super();
    this.type = "failed";
    this.title = "リクエストがキャンセルされました";
    this.message = toRequestUnit(request, false);
  }
}

export class RequestDeniedMessage extends SystemMessage {
  public constructor(request: RequestProps) {
    super();
    this.type = "failed";
    this.title = "リクエストが拒否されました";
    this.message = toRequestUnit(request, false);
  }
}

export class RequestListMessage extends SystemMessage {
  public constructor(requests: RequestProps[]) {
    super();
    this.type = "request";
    this.title = "リクエスト";
    if (requests.length > 0) {
      this.message = requests.map((element) => toRequestUnit(element)).join("\n\n");
    } else {
      this.message = "該当する結果はありませんでした。";
    }
  }
}

export class RequestSentMessage extends SystemMessage {
  public static readonly UserIdFieldName = "To";
  public static readonly IndexFieldName = "Request No.";

  public constructor(public readonly request: RequestProps) {
    super();
    this.type = "request";
    this.title = "リクエストが作成されました！";
    this.message = RequestSentMessage.buildDescription(request);
  }

  public getEmbed(): MessageEmbed {
    return super
      .getEmbed()
      .addField(RequestSentMessage.UserIdFieldName, toMention(this.request.targetUserId), true)
      .addField(RequestSentMessage.IndexFieldName, this.request.index.toString(), true);
  }

  public static getUserId(embed: MessageEmbed): string | undefined {
    const indexField = embed.fields.find((field) => field.name === RequestSentMessage.UserIdFieldName);
    if (!indexField) return;
    return removeMention(indexField.value);
  }

  public static getIndex(embed: MessageEmbed): number | undefined {
    const indexField = embed.fields.find((field) => field.name === RequestSentMessage.IndexFieldName);
    if (!indexField) return;
    return parseInt(indexField.value);
  }

  private static buildDescription(props: RequestProps): string {
    const content = `\`\`\`\n${props.content}\n\`\`\``;
    const messageForTarget = `${toMention(
      props.targetUserId
    )}\n承認→✅のリアクションを付ける\n拒否→❌のリアクションを付ける`;
    const messageForRequester = `${toMention(props.requesterUserId)}\nキャンセル→⛔のリアクションを付ける`;
    return `${content}\n${messageForTarget}\n\n${messageForRequester}`;
  }
}

export class SendRequestOwnMessage extends SystemMessage {
  public constructor() {
    super();
    this.type = "invalid";
    this.title = "自分自身にリクエストを送信することはできません";
  }
}

export class RequestNotFoundMessage extends SystemMessage {
  public constructor(specifier: RequestSpecifier) {
    super();
    this.type = "failed";
    this.title = "リクエストが見つかりませんでした";
    const identity = getIdentityCall(specifier);
    this.message = `${identity} は存在しない、もしくは削除された可能性があります。`;
  }
}
