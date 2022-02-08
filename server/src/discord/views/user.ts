import { SystemMessage } from "../structures";
import { UserStatsBodyView, UserSpecifierView, UserBodyView } from "./structures";

export class UserRegisteredMessage extends SystemMessage {
  public constructor(user: UserSpecifierView) {
    super();
    this.type = "succeed";
    this.title = "ユーザーが登録されました！";
    this.message = user.mention();
  }
}

export class UserRegisterRequiredMessage extends SystemMessage {
  public constructor() {
    super();
    this.type = "info";
    this.title = "ユーザーが登録されていません";
    this.message = [
      "当サービスを使用するには、ユーザー登録をしてください。",
      "```",
      "▼ スラッシュコマンドの場合",
      "/user register",
      "",
      "▼ メッセージに直接入力する場合",
      "!kimi user register",
      "```"
    ].join("\n");
  }
}

export class UserAlreadyRegisteredMessage extends SystemMessage {
  public constructor(user: UserSpecifierView) {
    super();
    this.type = "failed";
    this.title = "ユーザー登録に失敗しました";
    this.message = `${user.mention()} は既に登録されています`;
  }
}

export class UserNotFoundMessage extends SystemMessage {
  public constructor(user: UserSpecifierView) {
    super();
    this.type = "failed";
    this.title = "ユーザーが見つかりませんでした";
    this.message = `${user.mention()} は存在しない、もしくは削除された可能性があります。`;
  }
}

export class UserStatsMessage extends SystemMessage {
  public constructor(stats: UserStatsBodyView) {
    super();
    this.type = "user";
    this.title = "ユーザー";
    this.message = stats.detail();
  }
}

export class UserConfiguredMessage extends SystemMessage {
  public constructor(user: UserBodyView) {
    super();
    this.type = "user";
    this.title = "ユーザー";
    this.message = user.detail();
  }
}
