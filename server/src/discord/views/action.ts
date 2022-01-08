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
