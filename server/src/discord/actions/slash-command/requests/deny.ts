import { SessionIn } from "../../session";
import { ActionWith } from "../../base";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed, RequestDeniedEmbed } from "discord/views";
import { DenyRequestEndpoint, DenyRequestEndpointParams, DenyRequestEndpointResult } from "endpoints";

export class SlashCommandDenyRequestAction extends ActionWith<SlashCommandEvent, DenyRequestEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "request",
    subCommandName: "deny",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new Session(context, this.endpoint).run();
  }
}

class Session extends SessionIn<SlashCommandDenyRequestAction> {
  async fetch(): Promise<DenyRequestEndpointParams> {
    await Promise.resolve();

    const number = this.context.interaction.options.getInteger("number", true);

    return {
      clientDiscordId: this.context.member.id,
      index: number
    };
  }

  async onSucceed(result: DenyRequestEndpointResult) {
    const embed = new RequestDeniedEmbed({ request: result });
    await this.context.interaction.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionEndpointError) return;
    if (error instanceof RequestNotFoundEndpointError) return;
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed] });
  }
}
