import { MessageEmbed } from "discord.js";

export type SystemMessageType =
  | "none"
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

export class SystemMessage {
  public type: SystemMessageType = "none";
  public title = "";
  public message = "";

  private readonly generators: { [type in SystemMessageType]: (title: string) => MessageEmbed } = {
    none: (title) => new MessageEmbed().setTitle(`${title}`).setColor("DARKER_GREY"),
    succeed: (title) => new MessageEmbed().setTitle(`✅ ${title}`).setColor("GREEN"),
    deleted: (title) => new MessageEmbed().setTitle(`🗑 ${title}`).setColor("GREY"),
    profile: (title) => new MessageEmbed().setTitle(`📓 ${title}`).setColor("AQUA"),
    request: (title) => new MessageEmbed().setTitle(`📢 ${title}`).setColor("PURPLE"),
    user: (title) => new MessageEmbed().setTitle(`👤 ${title}`).setColor("DARK_BLUE"),
    info: (title) => new MessageEmbed().setTitle(`ℹ ${title}`).setColor("BLUE"),
    invalid: (title) => new MessageEmbed().setTitle(`🚫 ${title}`).setColor("DARK_GOLD"),
    failed: (title) => new MessageEmbed().setTitle(`❌ ${title}`).setColor("DARK_RED"),
    warning: (title) => new MessageEmbed().setTitle(`⚠ ${title}`).setColor("YELLOW"),
    error: (title) => new MessageEmbed().setTitle(`‼ERROR‼ ${title}`).setColor("RED")
  } as const;

  public getEmbed(): MessageEmbed {
    return this.generators[this.type](this.title).setDescription(this.message);
  }
}
