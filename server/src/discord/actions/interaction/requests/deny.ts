import { CreateMessageCommandEventContext, CreateMessageCommandEventListener } from "discord/events/interaction";
import { ErrorEmbed, RequestDeniedEmbed } from "discord/views";
import { NoPermissionError, NotFoundError } from "endpoints/errors";
import { RequestEndpoint } from "endpoints/request";

export class DenyRequestAction implements CreateMessageCommandEventListener {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    this.endpoint = endpoint;
  }

  async onMessageCommandCreated(context: CreateMessageCommandEventContext) {
    const number = context.interaction.options.getInteger("number", true);

    let request;
    try {
      request = await this.endpoint.deny(context.member.id, {
        index: number
      });
    } catch (error) {
      if (error instanceof NoPermissionError) return;
      if (error instanceof NotFoundError) return;
      const embed = new ErrorEmbed(error);
      await context.interaction.reply({ embeds: [embed] });
      return;
    }

    const embed = new RequestDeniedEmbed(request);
    await context.interaction.reply({ embeds: [embed] });
  }
}
