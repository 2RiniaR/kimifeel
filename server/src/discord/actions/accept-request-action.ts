import { Action, ActionBaseParams } from "../action";
import { Session } from "../session";
import { ReactionAddEvent, ReactionAddEventContext } from "../events";
import { DiscordFetchFailedActionError, NoPermissionActionError, RequestNotFoundActionError } from "../errors";
import { RequestEmbed, ErrorEmbed, RequestAcceptedEmbed } from "../views";

export type AcceptRequestParams = ActionBaseParams & {
  target: string;
  index: number;
};

export type AcceptRequestResult = {
  index: number;
  content: string;
  author: string;
};

export class AcceptRequestAction extends Action<ReactionAddEventContext, AcceptRequestParams, AcceptRequestResult> {
  protected defineEvent() {
    return new ReactionAddEvent(["✅"], { allowBot: false, myMessageOnly: true });
  }

  protected async onEvent(context: ReactionAddEventContext) {
    if (!this.listener) return;
    await new AcceptRequestSession(context, this.listener).run();
  }
}

export class AcceptRequestSession extends Session<AcceptRequestAction> {
  async fetch(): Promise<AcceptRequestParams> {
    await Promise.resolve();
    if (this.context.message.embeds.length === 0) throw new DiscordFetchFailedActionError();
    return {
      client: this.context.member.id,
      index: RequestEmbed.getIndex(this.context.message.embeds[0]),
      target: RequestEmbed.getUserId(this.context.message.embeds[0])
    };
  }

  async onSucceed() {
    const embed = new RequestAcceptedEmbed({
      userName: this.context.member.displayName,
      userAvatarURL: this.context.member.displayAvatarURL(),
      profile: {
        authorUserId: this.result.author,
        index: this.result.index,
        content: this.result.content
      }
    });
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionActionError) return;
    if (error instanceof RequestNotFoundActionError) return;
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
