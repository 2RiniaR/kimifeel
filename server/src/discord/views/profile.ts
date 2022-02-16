import { ProfileView } from "./structures";
import { Profile, SystemMessage } from "../structures";
import { ProfileMessageGenerator } from "../actions";

export class ProfileMessageGeneratorImpl implements ProfileMessageGenerator {
  public created(profile: Profile): SystemMessage {
    return {
      type: "succeed",
      title: "プロフィールを作成しました！",
      message: new ProfileView(profile).detail()
    };
  }

  public deleted(profile: Profile): SystemMessage {
    return {
      type: "deleted",
      title: "プロフィールを削除しました",
      message: new ProfileView(profile).abstract()
    };
  }

  public list(profiles: Profile[]): SystemMessage {
    let message;
    if (profiles.length > 0) {
      message = profiles.map((profile) => new ProfileView(profile).detail()).join("\n\n");
    } else {
      message = "該当する結果はありませんでした。";
    }

    return {
      type: "profile",
      title: "プロフィール",
      message
    };
  }
}
