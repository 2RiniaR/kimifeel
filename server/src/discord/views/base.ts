import { MessageEmbed } from "discord.js";

export type CustomMessageType =
  | "succeed"
  | "deleted"
  | "profile"
  | "request"
  | "user"
  | "info"
  | "invalid"
  | "failed"
  | "warning"
  | "error";

export class CustomMessageEmbed extends MessageEmbed {
  public readonly generators: { [type in CustomMessageType]: (title: string) => MessageEmbed } = {
    succeed: (title) => this.setTitle(`✅ ${title}`).setColor("GREEN"),
    deleted: (title) => this.setTitle(`🗑 ${title}`).setColor("GREY"),
    profile: (title) => this.setTitle(`📓 ${title}`).setColor("AQUA"),
    request: (title) => this.setTitle(`📢 ${title}`).setColor("PURPLE"),
    user: (title) => this.setTitle(`👤 ${title}`).setColor("DARK_BLUE"),
    info: (title) => this.setTitle(`ℹ ${title}`).setColor("BLUE"),
    invalid: (title) => this.setTitle(`🚫 ${title}`).setColor("DARK_GOLD"),
    failed: (title) => this.setTitle(`❌ ${title}`).setColor("DARK_RED"),
    warning: (title) => this.setTitle(`⚠ ${title}`).setColor("YELLOW"),
    error: (title) => this.setTitle(`‼ERROR‼ ${title}`).setColor("RED")
  } as const;

  constructor(type: CustomMessageType, title = "", message = "") {
    super();
    this.generators[type](title).setDescription(message);
  }
}
