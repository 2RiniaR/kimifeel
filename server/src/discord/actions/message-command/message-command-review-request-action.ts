import { ActionSessionIn } from "discord/actions/action-session";
import { MessageCommandEvent, MessageCommandEventContext, MessageCommandEventOptions } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed, RequestAcceptedEmbed } from "discord/views";
import { ActionWith } from "discord/action";
import {
  ChangeRequestControlType,
  ChangeRequestEndpoint,
  ChangeRequestEndpointParams,
  ChangeRequestEndpointResult
} from "endpoints";
import { basePhrase } from "./phrases";

export class MessageCommandReviewRequestAction extends ActionWith<MessageCommandEvent, ChangeRequestEndpoint> {
  readonly options: MessageCommandEventOptions = {
    prefixes: [`${basePhrase} review-request`, `${basePhrase} request review`],
    allowBot: false
  };

  async onEvent(context: MessageCommandEventContext) {
    await new MessageCommandChangeRequestSession(context, this.endpoint).run();
  }
}

class MessageCommandChangeRequestSession extends ActionSessionIn<MessageCommandReviewRequestAction> {
  async fetch(): Promise<ChangeRequestEndpointParams> {
    await Promise.resolve();
    if (this.context.arguments.length < 2) throw new Error();
    const index = parseInt(this.context.arguments[0]);
    const review = this.context.arguments[1];
    if (!(review in ["accept", "deny"])) throw new Error();

    return {
      clientDiscordId: this.context.member.id,
      index,
      targetDiscordId: this.context.member.id,
      controlType: review as ChangeRequestControlType
    };
  }

  async onSucceed(result: ChangeRequestEndpointResult) {
    const embed = new RequestAcceptedEmbed({
      userName: this.context.member.displayName,
      userAvatarURL: this.context.member.displayAvatarURL(),
      profile: {
        authorUserId: result.authorDiscordId,
        index: result.index,
        content: result.content
      }
    });
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionEndpointError) return;
    if (error instanceof RequestNotFoundEndpointError) return;
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
