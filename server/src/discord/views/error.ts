import { DiscordUserIdentity, ProfileIdentity, RequestIdentity, SystemMessage } from "../structures";
import { ProfileIdentityView, RequestIdentityView, UserIdentityView } from "./structures";
import { ErrorMessageGenerator } from "../actions";
import { code } from "./format";

export class ErrorMessageGeneratorImpl implements ErrorMessageGenerator {
  unavailable(): SystemMessage {
    return {
      type: "error",
      title: "現在サービスは利用できません"
    };
  }

  unknown(error: unknown): SystemMessage {
    const code = error instanceof Error ? error.name : "unknown";
    return {
      type: "error",
      title: "不明なエラー",
      message: [
        `コード: \`${code}\``,
        "",
        "▼ ここから制作者に報告してください。",
        "https://github.com/watano1168/kimifeel/issues"
      ].join("\n")
    };
  }

  commandArgumentUnexpected(expected: number, actual: number): SystemMessage {
    return {
      type: "invalid",
      title: "引数の個数が不正です",
      message: `${code(expected.toString())} 個の引数が必要ですが、${code(actual.toString())} 個入力されています。`
    };
  }

  commandOptionUnexpected(names: readonly string[]): SystemMessage {
    return {
      type: "invalid",
      title: "不明なオプションが入力されています",
      message: `オプション ${names.map((name) => code(name)).join(", ")} は要求されていません。`
    };
  }

  contentLengthLimited(min: number, max: number, actual: number): SystemMessage {
    return {
      type: "invalid",
      title: "内容が長すぎます",
      message: `${min}文字以上、かつ${max}文字以下にしてください。（現在：${actual}文字）`
    };
  }

  invalidFormat(position: string, format: string): SystemMessage {
    return {
      type: "invalid",
      title: "パラメータの形式が不正です",
      message: `${code(position)} には、 ${code(format)} を入力してください。`
    };
  }

  profileNotFound(profile: ProfileIdentity): SystemMessage {
    return {
      type: "failed",
      title: "プロフィールが見つかりませんでした",
      message: `${new ProfileIdentityView(profile).call()} は存在しない、もしくは削除された可能性があります。`
    };
  }

  requestNotFound(request: RequestIdentity): SystemMessage {
    return {
      type: "failed",
      title: "リクエストが見つかりませんでした",
      message: `${new RequestIdentityView(request).call()} は存在しない、もしくは削除された可能性があります。`
    };
  }

  sentRequestOwn(): SystemMessage {
    return {
      type: "failed",
      title: "リクエストが見つかりませんでした"
    };
  }

  userNotFound(user: DiscordUserIdentity): SystemMessage {
    return {
      type: "failed",
      title: "ユーザーが見つかりませんでした",
      message: `${new UserIdentityView(user).mention()} は存在しない、もしくは削除された可能性があります。`
    };
  }

  userAlreadyRegistered(user: DiscordUserIdentity): SystemMessage {
    return {
      type: "failed",
      title: "ユーザー登録に失敗しました",
      message: `${new UserIdentityView(user).mention()} は既に登録されています`
    };
  }

  userRegisterRequired(): SystemMessage {
    return {
      type: "info",
      title: "ユーザーが登録されていません",
      message: [
        "当サービスを使用するには、ユーザー登録をしてください。",
        "```",
        "▼ スラッシュコマンドの場合",
        "/user register",
        "",
        "▼ メッセージに直接入力する場合",
        "!kimi user register",
        "```"
      ].join("\n")
    };
  }
}
