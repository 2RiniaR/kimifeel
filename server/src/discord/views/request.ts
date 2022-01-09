import { CustomMessageEmbed } from "./base";
import { ProfileProps, toProfileUnit } from "./profile";
import { MessageEmbed } from "discord.js";
import { removeMention, toMention } from "./user";
import { RequestIdentifier } from "endpoints/structures";

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

function getIdentityCall(identifier: RequestIdentifier) {
  if ("id" in identifier) return `リクエスト ID: \`${identifier.id}\``;
  else return `プロフィール 番号: \`${identifier.index}\``;
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
    super("request", "リクエスト", requests.map((element) => toRequestUnit(element)).join("\n\n"));
  }
}

export class RequestSentEmbed extends CustomMessageEmbed {
  public static readonly UserIdFieldName = "To";
  public static readonly IndexFieldName = "Request No.";

  public constructor(props: RequestProps) {
    super("request", "リクエストが作成されました！", RequestSentEmbed.buildDescription(props));
    this.addField(RequestSentEmbed.UserIdFieldName, toMention(props.targetUserId), true).addField(
      RequestSentEmbed.IndexFieldName,
      props.index.toString(),
      true
    );
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

  private static buildDescription(props: RequestProps): string {
    const content = `\`\`\`\n${props.content}\n\`\`\``;
    const messageForTarget = `${toMention(
      props.targetUserId
    )}\n承認→✅のリアクションを付ける\n拒否→❌のリアクションを付ける`;
    const messageForRequester = `${toMention(props.requesterUserId)}\nキャンセル→⛔のリアクションを付ける`;
    return `${content}\n${messageForTarget}\n\n${messageForRequester}`;
  }
}

export class SendRequestOwnEmbed extends CustomMessageEmbed {
  public constructor() {
    super("invalid", "自分自身にリクエストを送信することはできません。");
  }
}

export class RequestNotFoundEmbed extends CustomMessageEmbed {
  public constructor(identifier: RequestIdentifier) {
    const identity = getIdentityCall(identifier);
    super(
      "failed",
      "リクエストが見つかりませんでした。",
      `${identity} は存在しない、もしくは削除された可能性があります。`
    );
  }
}
