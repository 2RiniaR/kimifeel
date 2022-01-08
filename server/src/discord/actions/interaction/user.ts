import { ErrorEmbed, UserRegisteredEmbed } from "discord/views";
import { UserEndpoint } from "endpoints/user";
import { NoPermissionError, NotFoundError } from "endpoints/errors";
import { CommandInteraction } from "discord.js";

export class UserAction {
  private readonly endpoint: UserEndpoint;

  constructor(endpoint: UserEndpoint) {
    this.endpoint = endpoint;
  }

  async register(command: CommandInteraction) {
    try {
      await this.endpoint.register(command.user.id);
    } catch (error) {
      if (error instanceof NoPermissionError) return;
      if (error instanceof NotFoundError) return;
      const embed = new ErrorEmbed(error);
      await command.reply({ embeds: [embed] });
      return;
    }

    const embed = new UserRegisteredEmbed({ discordId: command.user.id });
    await command.reply({ embeds: [embed] });
  }
}
