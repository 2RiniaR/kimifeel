import { RequestEmbed } from "../views/request-embed";
import { ErrorEmbed } from "../views/error-embed";
import { Action, ActionBaseParams, ContextOf, EventOf } from "~/discord/action";
import { ReactionAddEvent, ReactionAddEventContext } from "~/discord/events/reaction-add-event";
import { Endpoint } from "~/discord/endpoint";

export type AcceptRequestParams = ActionBaseParams & {
  index: number;
};

export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}

export class AcceptRequestAction extends Action<ReactionAddEventContext, AcceptRequestParams> {
  async fetchParams() {
    await Promise.resolve();
    if (this.context.message.embeds.length === 0) return;
    return {
      client: this.context.message.id,
      index: RequestEmbed.getIndex(this.context.message.embeds[0])
    };
  }

  async onSucceed() {
    await this.context.message.reply("リクエストが承認されました。");
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed({ type: "error", error });
    await this.context.message.reply({ embeds: [embed] });
  }
}

export class AcceptRequestEndpoint extends Endpoint<AcceptRequestAction> {
  protected defineEvent(): EventOf<AcceptRequestAction> {
    return new ReactionAddEvent(["✅"]);
  }

  protected async onEvent(context: ContextOf<AcceptRequestAction>): Promise<void> {
    if (!this.listener) return;
    await new AcceptRequestAction(context, this.listener).run();
  }
}
