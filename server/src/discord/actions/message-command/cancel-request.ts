import { ActionSessionIn } from "discord/actions/action-session";
import { MessageCommandEvent, MessageCommandEventContext, MessageCommandEventOptions } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed, RequestAcceptedEmbed } from "discord/views";
import { ActionWith } from "discord/actions/action";
import { ChangeRequestEndpoint, ChangeRequestEndpointParams, ChangeRequestEndpointResult } from "endpoints";
import { basePhrase } from "./phrases";
import { InvalidArgumentCountError } from "../../events/message-command-event/errors/invalid-argument-count-error";

const expectedArguments = ["リクエスト対象のユーザーID", "リクエストの番号"];
const format = {
  prefixes: [`${basePhrase} cancel-request`, `${basePhrase} request cancel`],
  arguments: ["string", "integer"],
  options: {}
} as const;

export class MessageCommandCancelRequestAction extends ActionWith<MessageCommandEvent<typeof format>, ChangeRequestEndpoint> {
  public readonly options = {
    format,
    allowBot: false
  };

  async onEvent(context: MessageCommandEventContext) {
    await new MessageCommandChangeRequestSession(context, this.endpoint).run();
  }
}

class MessageCommandChangeRequestSession extends ActionSessionIn<MessageCommandCancelRequestAction> {
  async fetch(): Promise<ChangeRequestEndpointParams> {
    await Promise.resolve();
    if (this.context.arguments.length !== expectedArguments.length) {
      throw new InvalidArgumentCountError(expectedArguments.length, this.context.arguments.length, commandFormat);
    }
    const targetDiscordId = this.context.arguments[0];
    const index = parseInt(this.context.arguments[1]);

    return {
      clientDiscordId: this.context..id,
      index,
      targetDiscordId: targetDiscordId,
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
