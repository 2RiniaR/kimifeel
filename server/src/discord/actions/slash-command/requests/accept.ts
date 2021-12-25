import { SessionIn } from "../../session";
import { ActionWith } from "../../base";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed, RequestAcceptedEmbed } from "discord/views";
import { AcceptRequestEndpoint, AcceptRequestEndpointParams, AcceptRequestEndpointResult } from "endpoints";

export class SlashCommandAcceptRequestAction extends ActionWith<SlashCommandEvent, AcceptRequestEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "request",
    subCommandName: "accept",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new Session(context, this.endpoint).run();
  }
}

class Session extends SessionIn<SlashCommandAcceptRequestAction> {
  async fetch(): Promise<AcceptRequestEndpointParams> {
    await Promise.resolve();

    const number = this.context.interaction.options.getInteger("number", true);

    return {
      clientDiscordId: this.context.member.id,
      index: number
    };
  }

  async onSucceed(result: AcceptRequestEndpointResult) {
    const embed = new RequestAcceptedEmbed({ profile: result });
    await this.context.interaction.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionEndpointError) return;
    if (error instanceof RequestNotFoundEndpointError) return;
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed] });
  }
}
