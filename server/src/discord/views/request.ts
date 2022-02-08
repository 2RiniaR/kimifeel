import { MessageEmbed } from "discord.js";
import { SystemMessage } from "../structures";
import { ProfileBodyView, RequestBodyView, RequestSpecifierView } from "./structures";

export class RequestAcceptedMessage extends SystemMessage {
  public constructor(profile: ProfileBodyView) {
    super();
    this.type = "succeed";
    this.title = "リクエストが承認されました！";
    this.message = profile.detail();
  }
}

export class RequestCanceledMessage extends SystemMessage {
  public constructor(request: RequestBodyView) {
    super();
    this.type = "failed";
    this.title = "リクエストがキャンセルされました";
    this.message = request.abstract();
  }
}

export class RequestDeniedMessage extends SystemMessage {
  public constructor(request: RequestBodyView) {
    super();
    this.type = "failed";
    this.title = "リクエストが拒否されました";
    this.message = request.abstract();
  }
}

export class RequestListMessage extends SystemMessage {
  public constructor(requests: RequestBodyView[]) {
    super();
    this.type = "request";
    this.title = "リクエスト";
    if (requests.length > 0) {
      this.message = requests.map((request) => request.detail()).join("\n\n");
    } else {
      this.message = "該当する結果はありませんでした。";
    }
  }
}

export class RequestSentMessage extends SystemMessage {
  public static readonly UserIdFieldName = "To";
  public static readonly IndexFieldName = "Request No.";

  public constructor(public readonly request: RequestBodyView) {
    super();
    this.type = "request";
    this.title = "リクエストが作成されました！";
    this.message = request.reviewCard();
  }

  public getEmbed(): MessageEmbed {
    return super
      .getEmbed()
      .addField(RequestSentMessage.UserIdFieldName, this.request.target.mention(), true)
      .addField(RequestSentMessage.IndexFieldName, this.request.index.toString(), true);
  }

  public static getIndex(embed: MessageEmbed): number | undefined {
    const indexField = embed.fields.find((field) => field.name === RequestSentMessage.IndexFieldName);
    if (!indexField) return;
    return parseInt(indexField.value);
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
  public constructor(request: RequestSpecifierView) {
    super();
    this.type = "failed";
    this.title = "リクエストが見つかりませんでした";
    this.message = `${request.call()} は存在しない、もしくは削除された可能性があります。`;
  }
}
