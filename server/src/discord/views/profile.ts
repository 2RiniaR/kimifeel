import { SystemMessage } from "../structures";
import { ProfileBodyView, ProfileSpecifierView } from "./structures";
import { code } from "./elements";

export class ProfileCreatedMessage extends SystemMessage {
  public constructor(profile: ProfileBodyView) {
    super();
    this.type = "succeed";
    this.title = "プロフィールを作成しました！";
    this.message = profile.detail();
  }
}

export class ProfileDeletedMessage extends SystemMessage {
  public constructor(profile: ProfileBodyView) {
    super();
    this.type = "deleted";
    this.title = "プロフィールを削除しました";
    this.message = profile.abstract();
  }
}

export class ProfileListMessage extends SystemMessage {
  public constructor(profiles: ProfileBodyView[]) {
    super();
    this.type = "profile";
    this.title = "プロフィール";
    if (profiles.length > 0) {
      this.message = profiles.map((profile) => profile.detail()).join("\n\n");
    } else {
      this.message = "該当する結果はありませんでした。";
    }
  }
}

export class ProfileNotFoundMessage extends SystemMessage {
  public constructor(profile: ProfileSpecifierView) {
    super();
    this.type = "failed";
    this.title = "プロフィールが見つかりませんでした";
    this.message = `${profile.call()} は存在しない、もしくは削除された可能性があります。`;
  }
}

export class ProfileContentLengthLimitMessage extends SystemMessage {
  public constructor(min: number, max: number, actual: number) {
    super();
    this.type = "invalid";
    this.title = "内容が長すぎます";
    this.message = `${min}文字以上、かつ${max}文字以下にしてください。（現在：${actual}文字）`;
  }
}
