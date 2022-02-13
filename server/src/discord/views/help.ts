import { SystemMessage } from "../structures";
import { HelpMessageGenerator } from "../actions";

export class HelpMessageGeneratorImpl implements HelpMessageGenerator {
  show(): SystemMessage {
    return new HelpMessage();
  }
}

export class HelpMessage implements SystemMessage {
  public readonly type = "info";
  public readonly title = "「キミフィール」ヘルプ";
  public readonly message;

  constructor() {
    this.message = [
      "他の人に自分のプロフィールを書いてもらえるサービスです。",
      "",
      "▼ チュートリアル",
      "https://kimifile.notion.site/2dbf5f01dfe94fe193d65135891478fe",
      "",
      "▼ ガイド",
      "https://kimifile.notion.site/473ae50d379048a39fe76437bf1c4b1c",
      "",
      "▼ リポジトリ",
      "https://github.com/watano1168/kimifeel",
      "",
      "▼ 制作者",
      "https://twitter.com/2RiniaR"
    ].join("\n");
  }
}
