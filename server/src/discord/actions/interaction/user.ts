import { UserRegisteredEmbed } from "discord/views";
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
