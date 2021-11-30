import { Action, ActionBaseParams } from "../action";
import { RequestEmbed, ErrorEmbed } from "../views";
import { ReactionAddEvent, ReactionAddEventContext } from "../events";
import { Session } from "../session";
import { NoPermissionActionError } from "../errors";

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
    if (error instanceof NoPermissionActionError) return;
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
