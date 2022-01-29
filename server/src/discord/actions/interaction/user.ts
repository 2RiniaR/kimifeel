import { UserConfiguredEmbed, UserRegisteredEmbed, UserStatsEmbed } from "discord/views";
import { CommandInteraction } from "discord.js";
import { CreateCommandEventAction } from "./base";
import { Endpoints } from "../endpoints";

export class RegisterUserAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(command: CommandInteraction) {
    const discordId = command.user.id;

    await this.endpoints.user.register(discordId);

    const embed = new UserRegisteredEmbed({ discordId });
    await command.reply({ embeds: [embed], ephemeral: true });
  }
}

export class ShowStatsUserAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(command: CommandInteraction) {
    const target = command.options.getUser("target", true);

    const user = await this.endpoints.user.getStats(command.user.id, {
      targetUserDiscordId: target.id
    });

    const embed = new UserStatsEmbed(user);
    await command.reply({ embeds: [embed], ephemeral: true });
  }
}

export class ConfigUserAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(command: CommandInteraction) {
    const enableMention = command.options.getBoolean("enable-mention", false) ?? undefined;

    const user = await this.endpoints.user.config(command.user.id, {
      enableMention
    });

    const embed = new UserConfiguredEmbed(user);
    await command.reply({ embeds: [embed], ephemeral: true });
  }
}
