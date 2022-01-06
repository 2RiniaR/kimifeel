import { MessageEmbed } from "discord.js";

export type CustomMessageType = keyof CustomMessageEmbed["generators"];

export class CustomMessageEmbed extends MessageEmbed {
  public readonly generators: { [type in string]: (title: string) => MessageEmbed } = {
    succeed: (title) => this.setTitle(`✅ ${title}`).setColor("GREEN"),
    deleted: (title) => this.setTitle(`🗑 ${title}`).setColor("GREY"),
    profile: (title) => this.setTitle(`📓 ${title}`).setColor("AQUA"),
    request: (title) => this.setTitle(`📢 ${title}`).setColor("PURPLE"),
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
