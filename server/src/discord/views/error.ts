import { SystemMessage } from "../structures";

export class ErrorMessage extends SystemMessage {
  constructor(error: unknown) {
    super();
    this.type = "error";
    this.title = "不明なエラー";
    const code = error instanceof Error ? error.name : "unknown";
    this.message = [
      `コード: \`${code}\``,
      "",
      "▼ ここから制作者に報告してください。",
      "https://github.com/watano1168/kimifeel/issues"
    ].join("\n");
  }
}

export class UnavailableMessage extends SystemMessage {
  constructor() {
    super();
    this.type = "error";
    this.title = "現在サービスは利用できません";
  }
}
