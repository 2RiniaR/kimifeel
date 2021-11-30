import { Action, ActionBaseParams } from "../action";
import { RequestEmbed, ErrorEmbed } from "../views";
import { ReactionAddEvent, ReactionAddEventContext } from "../events";
import { Session } from "../session";
import { NoPermissionActionError } from "../errors";

export type DenyRequestParams = ActionBaseParams & {
  index: number;
};

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
    if (error instanceof NoPermissionActionError) return;
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
