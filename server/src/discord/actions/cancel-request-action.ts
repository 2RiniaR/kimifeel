import { RequestEmbed } from "../views/request-embed";
import { ErrorEmbed } from "../views/error-embed";
import { ReactionAddEvent, ReactionAddEventContext } from "~/discord/events/reaction-add-event";
import { Action, ActionBaseParams } from "~/discord/action";
import { Session } from "~/discord/session";

export type CancelRequestParams = ActionBaseParams & {
  index: number;
};

export class CancelRequestAction extends Action<ReactionAddEventContext, CancelRequestParams> {
  protected defineEvent() {
    return new ReactionAddEvent(["⛔"]);
  }

  protected async onEvent(context: ReactionAddEventContext): Promise<void> {
    if (!this.listener) return;
    await new CancelRequestSession(context, this.listener).run();
  }
}

export class CancelRequestSession extends Session<CancelRequestAction> {
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
