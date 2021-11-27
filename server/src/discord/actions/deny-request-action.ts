import { RequestEmbed } from "../views/request-embed";
import { ErrorEmbed } from "../views/error-embed";
import { Session, ActionBaseParams, ContextOf, EventOf } from "~/discord/session";
import { ReactionAddEvent, ReactionAddEventContext } from "~/discord/events/reaction-add-event";
import { Action } from "~/discord/action";

export type DenyRequestParams = ActionBaseParams & {
  index: number;
};

export class DenyRequestSession extends Session<ReactionAddEventContext, DenyRequestParams> {
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

export class DenyRequestAction extends Action<DenyRequestSession> {
  protected defineEvent(): EventOf<DenyRequestSession> {
    return new ReactionAddEvent(["❌"]);
  }

  protected async onEvent(context: ContextOf<DenyRequestSession>): Promise<void> {
    if (!this.listener) return;
    await new DenyRequestSession(context, this.listener).run();
  }
}
