import { SystemMessage } from "../structures";

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
    this.message = `\`${position}\` には、 \`${format}\` を入力してください。`;
  }
}

export class CommandUnexpectedArgumentMessage extends SystemMessage {
  constructor(expected: number, actual: number) {
    super();
    this.type = "invalid";
    this.title = "引数の個数が不正です";
    this.message = `\`${expected.toString()}\` 個の引数が必要ですが、\`${actual.toString()}\` 個入力されています。`;
  }
}

export class CommandUnexpectedOptionMessage extends SystemMessage {
  constructor(options: readonly string[]) {
    super();
    this.type = "invalid";
    this.title = "不明なオプションが入力されています";
    this.message = `オプション ${options.map((name) => `\`${name}\``).join(", ")} は要求されていません。`;
  }
}
