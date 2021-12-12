import { SessionIn } from "../session";
import { ActionWith } from "../base";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed, RequestAcceptedEmbed } from "discord/views";
import {
  ChangeRequestControlType,
  ChangeRequestEndpoint,
  ChangeRequestEndpointParams,
  ChangeRequestEndpointResult
} from "endpoints";
import { basePhrase } from "./phrases";

const format = {
  prefixes: [`${basePhrase} reveiew-request`, `${basePhrase} request review`],
  arguments: [
    {
      name: "リクエストの番号",
      description: "",
      type: "integer"
    },
    {
      name: "操作",
      description: "",
      type: "string"
    }
  ],
  options: {}
} as const;

export class MessageCommandReviewRequestAction extends ActionWith<
  MessageCommandEvent<typeof format>,
  ChangeRequestEndpoint
> {
  readonly options = { format, allowBot: false };

  async onEvent(context: MessageCommandEventContext<typeof format>) {
    await new MessageCommandChangeRequestSession(context, this.endpoint).run();
  }
}

class MessageCommandChangeRequestSession extends SessionIn<MessageCommandReviewRequestAction> {
  async fetch(): Promise<ChangeRequestEndpointParams> {
    await Promise.resolve();
    const review = this.context.command.arguments[1];
    if (!(review in ["accept", "deny"])) throw new Error();

    return {
      clientDiscordId: this.context.member.id,
      index: this.context.command.arguments[0],
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
