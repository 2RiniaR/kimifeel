import { ProfileView, RequestView, UserIdentityView } from "./structures";
import { Profile, Request, RequestIdentity, SystemMessage, SystemMessageRead } from "../structures";
import { RequestMessageGenerator } from "../actions";

export class RequestMessageGeneratorImpl implements RequestMessageGenerator {
  accepted(profile: Profile): SystemMessage {
    return {
      type: "succeed",
      title: "リクエストが承認されました！",
      message: new ProfileView(profile).detail()
    };
  }

  canceled(request: Request): SystemMessage {
    return {
      type: "failed",
      title: "リクエストがキャンセルされました",
      message: new RequestView(request).abstract()
    };
  }

  denied(request: Request): SystemMessage {
    return {
      type: "failed",
      title: "リクエストが拒否されました",
      message: new RequestView(request).abstract()
    };
  }

  list(requests: Request[]): SystemMessage {
    let message;
    if (requests.length > 0) {
      message = requests.map((request) => new RequestView(request).detail()).join("\n\n");
    } else {
      message = "該当する結果はありませんでした。";
    }

    return {
      type: "request",
      title: "リクエスト",
      message
    };
  }

  sent(request: Request): SystemMessage {
    return new RequestSentMessage(request);
  }
}

export class RequestSentMessage implements SystemMessage {
  public static readonly UserIdFieldName = "To";
  public static readonly IndexFieldName = "Request No.";
  public readonly type = "request";
  public readonly title = "リクエストが作成されました！";
  public readonly message;
  public readonly fields;

  public constructor(public readonly request: Request) {
    this.message = new RequestView(request).reviewCard();
    this.fields = [
      {
        name: RequestSentMessage.UserIdFieldName,
        value: new UserIdentityView(this.request.target).mention(),
        inline: true
      },
      { name: RequestSentMessage.IndexFieldName, value: request.index.toString(), inline: true }
    ];
  }

  public static fromMessage(message: SystemMessageRead): RequestIdentity | undefined {
    if (!message.fields) return;
    const indexField = message.fields.find((field) => field.name === RequestSentMessage.IndexFieldName);
    if (!indexField) return;
    return { index: parseInt(indexField.value) };
  }
}
