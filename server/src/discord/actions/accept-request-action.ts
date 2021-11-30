import { Action, ActionBaseParams } from "../action";
import { Session } from "../session";
import { ReactionAddEvent, ReactionAddEventContext } from "../events";
import { NoPermissionActionError } from "../errors";
import { RequestEmbed, ErrorEmbed } from "../views";

export type AcceptRequestParams = ActionBaseParams & {
  index: number;
};

export class AcceptRequestAction extends Action<ReactionAddEventContext, AcceptRequestParams> {
  protected defineEvent() {
    return new ReactionAddEvent(["✅"]);
  }

  protected async onEvent(context: ReactionAddEventContext) {
    if (!this.listener) return;
    await new AcceptRequestSession(context, this.listener).run();
  }
}

export class AcceptRequestSession extends Session<AcceptRequestAction> {
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
    if (error instanceof NoPermissionActionError) return;
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
