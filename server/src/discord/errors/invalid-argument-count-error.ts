import { ActionError } from "./action-error";

export class InvalidArgumentCountError extends ActionError {
  public readonly title = "引数の個数に誤りがあります。";
  public readonly messageType = "invalid";
  public readonly expected: number;
  public readonly actual: number;
  public readonly formats: string[];
  public readonly message: string;

  public constructor(expected: number, actual: number, formats: string[]) {
    super();
    this.expected = expected;
    this.actual = actual;
    this.formats = formats;

    const formatMessage = `\`\`\`${formats.join("\n")}\`\`\`\n`;
    const descriptionMessage = `**${expected.toString()}** 個の引数が必要ですが、与えられた引数は **${actual.toString()}** 個でした。`;
    this.message = formatMessage + descriptionMessage;
  }
}
