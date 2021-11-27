import { RequestEmbed } from "../views/request-embed";
import { ErrorEmbed } from "../views/error-embed";
import { Action, ActionBaseParams, ContextOf, EventOf } from "~/discord/action";
import { ReactionAddEvent, ReactionAddEventContext } from "~/discord/events/reaction-add-event";
import { Endpoint } from "~/discord/endpoint";

export type CancelRequestParams = ActionBaseParams & {
  index: number;
};

export class CancelRequestAction extends Action<ReactionAddEventContext, CancelRequestParams> {
  async fetchParams() {
    await Promise.resolve();
    if (this.context.message.embeds.length === 0) return;
    return {
      client: this.context.message.id,
      index: RequestEmbed.getIndex(this.context.message.embeds[0])
    };
  }

  async onSucceed() {
    await this.context.message.reply("リクエストがキャンセルされました。");
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed({ type: "error", error });
    await this.context.message.reply({ embeds: [embed] });
  }
}

export class CancelRequestEndpoint extends Endpoint<CancelRequestAction> {
  protected defineEvent(): EventOf<CancelRequestAction> {
    return new ReactionAddEvent(["⛔"]);
  }

  protected async onEvent(context: ContextOf<CancelRequestAction>): Promise<void> {
    if (!this.listener) return;
    await new CancelRequestAction(context, this.listener).run();
  }
}
