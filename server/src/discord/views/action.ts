import { CustomMessageEmbed } from "./base";

export class FetchFailedEmbed extends CustomMessageEmbed {
  constructor() {
    super("failed", "Discordのデータ取得に失敗しました。", "Discordから、何らかのデータを取得することに失敗しました。");
  }
}

export class ParameterFormatInvalidEmbed extends CustomMessageEmbed {
  constructor(position: string, format: string) {
    super("invalid", "パラメータの形式が不正です。", `\`${position}\` には、 \`${format}\` を入力してください。`);
  }
}

export class CommandUnexpectedArgumentEmbed extends CustomMessageEmbed {
  constructor(expected: number, actual: number) {
    super(
      "invalid",
      "引数の個数が不正です。",
      `\`${expected.toString()}\` 個の引数が必要ですが、\`${actual.toString()}\` 個入力されています。`
    );
  }
}

export class CommandUnexpectedOptionEmbed extends CustomMessageEmbed {
  constructor(options: readonly string[]) {
    super(
      "invalid",
      "不明なオプションが入力されています。",
      `オプション ${options.map((name) => `\`${name}\``).join(", ")} は要求されていません。`
    );
  }
}
