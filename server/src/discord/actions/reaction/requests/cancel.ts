import { SessionIn } from "../../session";
import { ReactionAddEvent, ReactionAddEventContext, ReactionAddEventOptions } from "discord/events";
import { DiscordFetchFailedActionError } from "../../errors";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { RequestSentEmbed, ErrorEmbed, RequestCanceledEmbed } from "discord/views";
import { ActionWith } from "../../base";
import { CancelRequestEndpoint, CancelRequestEndpointParams, CancelRequestEndpointResult } from "endpoints";

export class ReactionCancelRequestAction extends ActionWith<ReactionAddEvent, CancelRequestEndpoint> {
  static emojis = ["⛔"];

  readonly options: ReactionAddEventOptions = {
    emojis: ReactionCancelRequestAction.emojis,
    allowBot: false,
    myMessageOnly: true
  };

  onEvent(context: ReactionAddEventContext): Promise<void> {
    return new Session(context, this.endpoint).run();
  }
}

class Session extends SessionIn<ReactionCancelRequestAction> {
  async fetch(): Promise<CancelRequestEndpointParams> {
    await Promise.resolve();

    if (this.context.message.embeds.length === 0) {
      throw new DiscordFetchFailedActionError();
    }
    const requestEmbed = this.context.message.embeds[0];
    const index = RequestSentEmbed.getIndex(requestEmbed);
    if (!index) {
      throw new DiscordFetchFailedActionError();
    }

    return {
      clientDiscordId: this.context.member.id,
      index
    };
  }

  async onSucceed(result: CancelRequestEndpointResult) {
    const embed = new RequestCanceledEmbed({ request: result });
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionEndpointError) return;
    if (error instanceof RequestNotFoundEndpointError) return;
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
