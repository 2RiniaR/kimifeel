import { CustomMessageEmbed } from "./base";

export class ErrorEmbed extends CustomMessageEmbed {
  constructor(error: unknown) {
    if (error instanceof Error) {
      super("error", "不明なエラー", "管理者に報告してください。");
    } else {
      super("error", "不明なエラー", "詳細な情報はありません。");
    }
  }
}
