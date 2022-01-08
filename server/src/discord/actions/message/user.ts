import { Message } from "discord.js";
import { UserEndpoint } from "endpoints/user";
import { UserRegisteredEmbed } from "discord/views";
import { CreateCommandEventAction } from "./base";

export class RegisterUserAction extends CreateCommandEventAction {
  private readonly endpoint: UserEndpoint;

  constructor(endpoint: UserEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(message: Message) {
    const discordId = message.author.id;

    await this.endpoint.register(discordId);

    const embed = new UserRegisteredEmbed({ discordId });
    await message.reply({ embeds: [embed] });
  }
}
