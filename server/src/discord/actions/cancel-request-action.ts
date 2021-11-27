import { RequestEmbed } from "../views/request-embed";
import { ErrorEmbed } from "../views/error-embed";
import { Session, ActionBaseParams, ContextOf, EventOf } from "~/discord/session";
import { ReactionAddEvent, ReactionAddEventContext } from "~/discord/events/reaction-add-event";
import { Action } from "~/discord/action";

export type CancelRequestParams = ActionBaseParams & {
  index: number;
};

export class CancelRequestSession extends Session<ReactionAddEventContext, CancelRequestParams> {
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

export class CancelRequestAction extends Action<CancelRequestSession> {
  protected defineEvent(): EventOf<CancelRequestSession> {
    return new ReactionAddEvent(["⛔"]);
  }

  protected async onEvent(context: ContextOf<CancelRequestSession>): Promise<void> {
    if (!this.listener) return;
    await new CancelRequestSession(context, this.listener).run();
  }
}
