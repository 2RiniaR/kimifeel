import { MessageEmbed } from "discord.js";

/*
succeed : 処理に成功したとき
info    : 追加の情報があるとき
invalid : ユーザーによる操作が誤ったものだったとき
failed  : ユーザーの操作は誤ってないが、処理が想定内の失敗をしたとき
warning : 処理は失敗していないが、好ましくない結果となったとき
error   : 処理が失敗したうえ、想定外の失敗だったとき
 */
export type SystemMessageType = "succeed" | "deleted" | "info" | "invalid" | "failed" | "warning" | "error";

export class SystemMessageEmbed extends MessageEmbed {
  private readonly generators: { [type in SystemMessageType]: (title: string) => MessageEmbed } = {
    succeed: (title) => this.setTitle(`✅ ${title}`).setColor("GREEN"),
    deleted: (title) => this.setTitle(`🗑 ${title}`).setColor("GREY"),
    info: (title) => this.setTitle(`📓 ${title}`).setColor("BLUE"),
    invalid: (title) => this.setTitle(`🚫 ${title}`).setColor("DARK_GOLD"),
    failed: (title) => this.setTitle(`❌ ${title}`).setColor("DARK_RED"),
    warning: (title) => this.setTitle(`⚠ ${title}`).setColor("YELLOW"),
    error: (title) => this.setTitle(`‼ERROR‼ ${title}`).setColor("RED")
  } as const;

  constructor(type: SystemMessageType, title = "", message = "") {
    super();
    this.generators[type](title).setDescription(message);
  }
}
