import { MessageEmbed } from "discord.js";
import { SystemMessage, SystemMessageRead, SystemMessageType } from "../../structures";

export class SystemMessageCreator {
  public static defaultType: SystemMessageType = "none";

  public constructor(public readonly systemMessage: SystemMessage) {}

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

  public create(): MessageEmbed {
    const type = this.systemMessage.type ?? SystemMessageCreator.defaultType;
    const title = this.systemMessage.title ?? "";
    const embed = this.generators[type](title);
    if (this.systemMessage.message) embed.setDescription(this.systemMessage.message);
    if (this.systemMessage.fields) embed.addFields(this.systemMessage.fields);
    return embed;
  }
}

export class SystemMessageReader {
  public constructor(public readonly embed: MessageEmbed) {}

  public read(): SystemMessageRead {
    return {
      title: this.embed.title ?? undefined,
      message: this.embed.description ?? undefined,
      fields: this.embed.fields
    };
  }
}
