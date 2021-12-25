import { SessionIn } from "../../session";
import { ActionWith } from "../../base";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed, RequestCanceledEmbed } from "discord/views";
import { CancelRequestEndpoint, CancelRequestEndpointParams, CancelRequestEndpointResult } from "endpoints";

export class SlashCommandCancelRequestAction extends ActionWith<SlashCommandEvent, CancelRequestEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "request",
    subCommandName: "cancel",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new Session(context, this.endpoint).run();
  }
}

class Session extends SessionIn<SlashCommandCancelRequestAction> {
  async fetch(): Promise<CancelRequestEndpointParams> {
    await Promise.resolve();

    const number = this.context.interaction.options.getInteger("number", true);
    const target = this.context.interaction.options.getUser("target", true);

    return {
      clientDiscordId: this.context.member.id,
      index: number,
      targetDiscordId: target.id
    };
  }

  async onSucceed(result: CancelRequestEndpointResult) {
    const embed = new RequestCanceledEmbed({ request: result });
    await this.context.interaction.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionEndpointError) return;
    if (error instanceof RequestNotFoundEndpointError) return;
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed] });
  }
}
