import { UserConfiguredEmbed, UserRegisteredEmbed, UserStatisticsEmbed } from "discord/views";
import { UserEndpoint } from "endpoints/user";
import { CommandInteraction } from "discord.js";
import { CreateCommandEventAction } from "./base";

export class RegisterUserAction extends CreateCommandEventAction {
  private readonly endpoint: UserEndpoint;

  constructor(endpoint: UserEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(command: CommandInteraction) {
    const discordId = command.user.id;

    await this.endpoint.register(discordId);

    const embed = new UserRegisteredEmbed({ discordId });
    await command.reply({ embeds: [embed], ephemeral: true });
  }
}

export class ShowUserAction extends CreateCommandEventAction {
  private readonly endpoint: UserEndpoint;

  constructor(endpoint: UserEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(command: CommandInteraction) {
    const target = command.options.getUser("target", false) ?? command.user;

    const user = await this.endpoint.show(command.user.id, {
      targetUserDiscordId: target.id
    });

    const embed = new UserStatisticsEmbed(user);
    await command.reply({ embeds: [embed], ephemeral: true });
  }
}

export class ConfigUserAction extends CreateCommandEventAction {
  private readonly endpoint: UserEndpoint;

  constructor(endpoint: UserEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(command: CommandInteraction) {
    const enableMention = command.options.getBoolean("enable-mention", false) ?? undefined;

    const user = await this.endpoint.config(command.user.id, {
      enableMention
    });

    const embed = new UserConfiguredEmbed(user);
    await command.reply({ embeds: [embed], ephemeral: true });
  }
}
