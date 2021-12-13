import { SessionIn } from "../session";
import { ReactionAddEvent, ReactionAddEventContext, ReactionAddEventOptions } from "discord/events";
import { DiscordFetchFailedActionError } from "../errors";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { RequestSentEmbed, ErrorEmbed, RequestAcceptedEmbed } from "discord/views";
import { ActionWith } from "../base";
import { AcceptRequestEndpoint, AcceptRequestEndpointParams, AcceptRequestEndpointResult } from "endpoints";

export class ReactionAcceptRequestAction extends ActionWith<ReactionAddEvent, AcceptRequestEndpoint> {
  static emojis = ["✅"];

  readonly options: ReactionAddEventOptions = {
    emojis: ReactionAcceptRequestAction.emojis,
    allowBot: false,
    myMessageOnly: true
  };

  onEvent(context: ReactionAddEventContext): Promise<void> {
    return new ReactionAcceptRequestSession(context, this.endpoint).run();
  }
}

class ReactionAcceptRequestSession extends SessionIn<ReactionAcceptRequestAction> {
  async fetch(): Promise<AcceptRequestEndpointParams> {
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

  async onSucceed(result: AcceptRequestEndpointResult) {
    const embed = new RequestAcceptedEmbed({ profile: result });
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionEndpointError) return;
    if (error instanceof RequestNotFoundEndpointError) return;
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
