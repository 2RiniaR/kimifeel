import { UserStatsView, UserIdentityView, UserView } from "./structures";
import { DiscordUser, DiscordUserIdentity, DiscordUserStats, SystemMessage } from "../structures";
import { UserMessageGenerator } from "../actions";

export class UserMessageGeneratorImpl implements UserMessageGenerator {
  configured(user: DiscordUser): SystemMessage {
    return {
      type: "user",
      title: "ユーザー",
      message: new UserView(user).detail()
    };
  }

  registered(user: DiscordUserIdentity): SystemMessage {
    return {
      type: "succeed",
      title: "ユーザーが登録されました！",
      message: new UserIdentityView(user).mention()
    };
  }

  stats(stats: DiscordUserStats): SystemMessage {
    return {
      type: "user",
      title: "ユーザー",
      message: new UserStatsView(stats).detail()
    };
  }
}
