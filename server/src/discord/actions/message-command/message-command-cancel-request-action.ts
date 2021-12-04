import { ActionSessionIn } from "discord/actions/action-session";
import { MessageCommandEvent, MessageCommandEventContext, MessageCommandEventOptions } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed, RequestAcceptedEmbed } from "discord/views";
import { ActionWith } from "discord/action";
import { ChangeRequestEndpoint, ChangeRequestEndpointParams, ChangeRequestEndpointResult } from "endpoints";
import { basePhrase } from "./phrases";
import { InvalidArgumentCountError } from "../../errors/invalid-argument-count-error";

const prefixes = [`${basePhrase} cancel-request`, `${basePhrase} request cancel`];
const expectedArguments = ["リクエスト対象のユーザーID", "リクエストの番号"];
const commandFormat = prefixes.map((prefix) => `${prefix} ${expectedArguments.join(" ")}`);

export class MessageCommandCancelRequestAction extends ActionWith<MessageCommandEvent, ChangeRequestEndpoint> {
  public readonly options: MessageCommandEventOptions = {
    prefixes,
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
      clientDiscordId: this.context.member.id,
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
