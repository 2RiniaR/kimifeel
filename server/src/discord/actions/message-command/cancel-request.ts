import { SessionIn } from "../session";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed, RequestAcceptedEmbed } from "discord/views";
import { ActionWith } from "../base";
import { ChangeRequestEndpoint, ChangeRequestEndpointParams, ChangeRequestEndpointResult } from "endpoints";
import { basePhrase } from "./phrases";

const format = {
  prefixes: [`${basePhrase} cancel-request`, `${basePhrase} request cancel`],
  arguments: [
    {
      name: "リクエスト対象のユーザーID",
      description: "",
      type: "userId"
    },
    {
      name: "リクエストの番号",
      description: "",
      type: "integer"
    }
  ],
  options: {}
} as const;

export class MessageCommandCancelRequestAction extends ActionWith<
  MessageCommandEvent<typeof format>,
  ChangeRequestEndpoint
> {
  public readonly options = {
    format,
    allowBot: false
  };

  async onEvent(context: MessageCommandEventContext<typeof format>) {
    await new MessageCommandChangeRequestSession(context, this.endpoint).run();
  }
}

class MessageCommandChangeRequestSession extends SessionIn<MessageCommandCancelRequestAction> {
  async fetch(): Promise<ChangeRequestEndpointParams> {
    await Promise.resolve();

    return {
      clientDiscordId: this.context.member.id,
      index: this.context.command.arguments[1],
      targetDiscordId: this.context.command.arguments[0],
      controlType: "cancel"
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
