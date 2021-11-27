import { RequestEmbed } from "../views/request-embed";
import { ErrorEmbed } from "../views/error-embed";
import { Action, ActionBaseParams, ContextOf, EventOf } from "~/discord/action";
import { ReactionAddEvent, ReactionAddEventContext } from "~/discord/events/reaction-add-event";
import { Endpoint } from "~/discord/endpoint";

export type DenyRequestParams = ActionBaseParams & {
  index: number;
};

export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}

export class DenyRequestAction extends Action<ReactionAddEventContext, DenyRequestParams> {
  async fetchParams() {
    await Promise.resolve();
    if (this.context.message.embeds.length === 0) return;
    return {
      client: this.context.message.id,
      index: RequestEmbed.getIndex(this.context.message.embeds[0])
    };
  }

  async onSucceed() {
    await this.context.message.reply("リクエストが拒否されました。");
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed({ type: "error", error });
    await this.context.message.reply({ embeds: [embed] });
  }
}

export class DenyRequestEndpoint extends Endpoint<DenyRequestAction> {
  protected defineEvent(): EventOf<DenyRequestAction> {
    return new ReactionAddEvent(["❌"]);
  }

  protected async onEvent(context: ContextOf<DenyRequestAction>): Promise<void> {
    if (!this.listener) return;
    await new DenyRequestAction(context, this.listener).run();
  }
}
