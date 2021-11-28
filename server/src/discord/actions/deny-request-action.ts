import { RequestEmbed } from "../views/request-embed";
import { ErrorEmbed } from "../views/error-embed";
import { ReactionAddEvent, ReactionAddEventContext } from "~/discord/events/reaction-add-event";
import { Action, ActionBaseParams } from "~/discord/action";
import { Session } from "~/discord/session";

export type DenyRequestParams = ActionBaseParams & {
  index: number;
};

export class RequestNotFoundError extends Error {
  message = "対象のリクエストは見つかりませんでした。既に承認・拒否・キャンセルされた可能性があります。";
}

export class ForbiddenError extends Error {}

export class DenyRequestAction extends Action<ReactionAddEventContext, DenyRequestParams> {
  protected defineEvent() {
    return new ReactionAddEvent(["❌"]);
  }

  protected async onEvent(context: ReactionAddEventContext) {
    if (!this.listener) return;
    await new DenyRequestSession(context, this.listener).run();
  }
}

export class DenyRequestSession extends Session<DenyRequestAction> {
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
    if (error instanceof ForbiddenError) return;
    const embed = new ErrorEmbed({ type: "error", error });
    await this.context.message.reply({ embeds: [embed] });
  }
}
