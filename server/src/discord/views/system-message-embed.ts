import { MessageEmbed } from "discord.js";

/*
info    : 追加の情報があるとき
invalid : ユーザーによる操作が誤ったものだったとき
failed  : ユーザーの操作は誤ってないが、処理が想定内の失敗をしたとき
warning : 処理は失敗していないが、好ましくない結果となったとき
error   : 処理が失敗したうえ、想定外の失敗だったとき
 */
export type SystemMessageType = "info" | "invalid" | "failed" | "warning" | "error";

export type SystemMessageEmbedProps = {
  type: SystemMessageType;
  message: string;
};

export class SystemMessageEmbed extends MessageEmbed {
  private generators: { [type in SystemMessageType]: () => MessageEmbed } = {
    info: () => this.setTitle("ℹ情報").setColor("GREY"),
    invalid: () => this.setTitle("⛔拒否").setColor("DARK_GOLD"),
    failed: () => this.setTitle("❌失敗").setColor("DARK_RED"),
    warning: () => this.setTitle("⚠警告").setColor("YELLOW"),
    error: () => this.setTitle("‼エラー").setColor("RED")
  };

  constructor(props: SystemMessageEmbedProps) {
    super();
    this.generators[props.type]().setDescription(props.message);
  }
}
