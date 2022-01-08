import { Message } from "discord.js";
import { UserEndpoint } from "endpoints/user";
import { NoPermissionError, NotFoundError } from "endpoints/errors";
import { ErrorEmbed, UserRegisteredEmbed } from "discord/views";

export class UserAction {
  private readonly endpoint: UserEndpoint;

  constructor(endpoint: UserEndpoint) {
    this.endpoint = endpoint;
  }

  async register(message: Message) {
    try {
      await this.endpoint.register(message.author.id);
    } catch (error) {
      if (error instanceof NoPermissionError) return;
      if (error instanceof NotFoundError) return;
      const embed = new ErrorEmbed(error);
      await message.reply({ embeds: [embed] });
      return;
    }

    const embed = new UserRegisteredEmbed({ discordId: message.author.id });
    await message.reply({ embeds: [embed] });
  }
}
