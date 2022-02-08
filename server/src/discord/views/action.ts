import { SystemMessage } from "../structures";
import { code } from "./elements";

export class FetchFailedMessage extends SystemMessage {
  constructor() {
    super();
    this.type = "failed";
    this.title = "Discordのデータ取得に失敗しました";
    this.message = "Discordから、何らかのデータを取得することに失敗しました。";
  }
}

export class ParameterFormatInvalidMessage extends SystemMessage {
  constructor(position: string, format: string) {
    super();
    this.type = "invalid";
    this.title = "パラメータの形式が不正です";
    this.message = `${code(position)} には、 ${code(format)} を入力してください。`;
  }
}

export class CommandUnexpectedArgumentMessage extends SystemMessage {
  constructor(expected: number, actual: number) {
    super();
    this.type = "invalid";
    this.title = "引数の個数が不正です";
    this.message = `${code(expected.toString())} 個の引数が必要ですが、${code(actual.toString())} 個入力されています。`;
  }
}

export class CommandUnexpectedOptionMessage extends SystemMessage {
  constructor(options: readonly string[]) {
    super();
    this.type = "invalid";
    this.title = "不明なオプションが入力されています";
    this.message = `オプション ${options.map((name) => code(name)).join(", ")} は要求されていません。`;
  }
}
