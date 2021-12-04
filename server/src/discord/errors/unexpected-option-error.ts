import { ActionError } from "./action-error";

export class UnexpectedOptionError extends ActionError {
  public readonly title = "不明なオプションです。";
  public readonly messageType = "invalid";
  public readonly name: string;
  public readonly formats: string[];
  public readonly message: string;

  public constructor(name: string, formats: string[]) {
    super();
    this.name = name;
    this.formats = formats;

    const formatMessage = `\`\`\`${formats.join("\n")}\`\`\`\n`;
    const descriptionMessage = `オプション **${name}** は存在しません。`;
    this.message = formatMessage + descriptionMessage;
  }
}
