import { CustomMessageEmbed } from "./base";

export class ErrorEmbed extends CustomMessageEmbed {
  constructor(error: unknown) {
    const code = error instanceof Error ? error.name : "unknown";
    const message = [
      `コード: ${code}`,
      "",
      "▼ ここから制作者に報告してください。",
      "https://github.com/watano1168/kimifeel/issues"
    ].join("\n");
    super("error", "不明なエラー", message);
  }
}
