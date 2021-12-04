import { ActionError } from "./action-error";

export type ArgumentExpression = { optionName: string } | { argumentIndex: number };

function argumentToMessage(argument: ArgumentExpression) {
  if ("optionName" in argument) return `${argument.optionName}の引数`;
  return `第${argument.argumentIndex.toString()}引数`;
}

export class InvalidArgumentFormatError extends ActionError {
  public readonly title = "引数の個数に誤りがあります。";
  public readonly messageType = "invalid";
  public readonly expected: string;
  public readonly argument: ArgumentExpression;
  public readonly formats: string[];
  public readonly message: string;

  public constructor(expected: string, argument: ArgumentExpression, formats: string[]) {
    super();
    this.expected = expected;
    this.argument = argument;
    this.formats = formats;

    const formatMessage = `\`\`\`${formats.join("\n")}\`\`\`\n`;
    const descriptionMessage = `**${argumentToMessage(argument)}** には **${expected}** を入力してください。`;
    this.message = formatMessage + descriptionMessage;
  }
}
