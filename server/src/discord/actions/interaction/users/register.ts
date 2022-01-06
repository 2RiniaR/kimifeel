import { ErrorEmbed, UserRegisteredEmbed } from "discord/views";
import { CreateMessageCommandEventContext, CreateMessageCommandEventListener } from "discord/events/interaction";
import { UserEndpoint } from "endpoints/user";
import { NoPermissionError, NotFoundError } from "endpoints/errors";

export class RegisterUserAction implements CreateMessageCommandEventListener {
  private readonly endpoint: UserEndpoint;

  constructor(endpoint: UserEndpoint) {
    this.endpoint = endpoint;
  }

  async onMessageCommandCreated(context: CreateMessageCommandEventContext) {
    const discordId = context.member.id;

    try {
      await this.endpoint.register(discordId);
    } catch (error) {
      if (error instanceof NoPermissionError) return;
      if (error instanceof NotFoundError) return;
      const embed = new ErrorEmbed(error);
      await context.interaction.reply({ embeds: [embed] });
      return;
    }

    const embed = new UserRegisteredEmbed({ discordId });
    await context.interaction.reply({ embeds: [embed] });
  }
}
