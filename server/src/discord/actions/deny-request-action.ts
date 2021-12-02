import { Endpoint, EndpointParamsBase } from "../endpoint";
import { RequestEmbed, ErrorEmbed, RequestDeniedEmbed } from "../views";
import { ReactionAddEvent, ReactionAddEventContext } from "../events";
import { Session } from "../session";
import { DiscordFetchFailedActionError, NoPermissionActionError, RequestNotFoundActionError } from "../errors";

export type DenyRequestParams = EndpointParamsBase & {
  target: string;
  index: number;
};

export class DenyRequestAction extends Endpoint<ReactionAddEventContext, DenyRequestParams> {
  protected defineEvent() {
    return new ReactionAddEvent(["❌"], { allowBot: false, myMessageOnly: true });
  }

  protected async onEvent(context: ReactionAddEventContext) {
    if (!this.listener) return;
    await new DenyRequestSession(context, this.listener).run();
  }
}

export class DenyRequestSession extends Session<DenyRequestAction> {
  async fetch(): Promise<DenyRequestParams> {
    await Promise.resolve();
    if (this.context.message.embeds.length === 0) throw new DiscordFetchFailedActionError();
    return {
      clientDiscordId: this.context.member.id,
      index: RequestEmbed.getIndex(this.context.message.embeds[0]),
      target: RequestEmbed.getUserId(this.context.message.embeds[0])
    };
  }

  async onSucceed() {
    const embed = new RequestDeniedEmbed();
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionActionError) return;
    if (error instanceof RequestNotFoundActionError) return;
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
