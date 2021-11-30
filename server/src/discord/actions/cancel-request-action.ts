import { Action, ActionBaseParams } from "../action";
import { RequestEmbed, ErrorEmbed, RequestCanceledEmbed } from "../views";
import { ReactionAddEvent, ReactionAddEventContext } from "../events";
import { Session } from "../session";
import { DiscordFetchFailedActionError, NoPermissionActionError, RequestNotFoundActionError } from "../errors";

export type CancelRequestParams = ActionBaseParams & {
  target: string;
  index: number;
};

export class CancelRequestAction extends Action<ReactionAddEventContext, CancelRequestParams> {
  protected defineEvent() {
    return new ReactionAddEvent(["⛔"], { allowBot: false, myMessageOnly: true });
  }

  protected async onEvent(context: ReactionAddEventContext): Promise<void> {
    if (!this.listener) return;
    await new CancelRequestSession(context, this.listener).run();
  }
}

export class CancelRequestSession extends Session<CancelRequestAction> {
  async fetch(): Promise<CancelRequestParams> {
    await Promise.resolve();
    if (this.context.message.embeds.length === 0) throw new DiscordFetchFailedActionError();
    return {
      client: this.context.member.id,
      index: RequestEmbed.getIndex(this.context.message.embeds[0]),
      target: RequestEmbed.getUserId(this.context.message.embeds[0])
    };
  }

  async onSucceed() {
    const embed = new RequestCanceledEmbed();
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionActionError) return;
    if (error instanceof RequestNotFoundActionError) return;
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
