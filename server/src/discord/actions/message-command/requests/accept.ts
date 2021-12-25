import { ActionWith } from "../../base";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed, RequestAcceptedEmbed } from "discord/views";
import { AcceptRequestEndpoint, AcceptRequestEndpointParams, AcceptRequestEndpointResult } from "endpoints";
import { basePhrase } from "../phrases";
import { MessageCommandSession } from "../session";

const format = {
  prefixes: [`${basePhrase} request accept`],
  arguments: [
    {
      name: "リクエストの番号",
      description: "",
      type: "integer"
    }
  ],
  options: {}
} as const;

export class MessageCommandAcceptRequestAction extends ActionWith<MessageCommandEvent, AcceptRequestEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: MessageCommandEventContext) {
    await new Session(context, this.endpoint, format).run();
  }
}

class Session extends MessageCommandSession<MessageCommandAcceptRequestAction, typeof format> {
  async fetch(): Promise<AcceptRequestEndpointParams> {
    await Promise.resolve();
    return {
      clientDiscordId: this.context.member.id,
      index: this.command.arguments[0]
    };
  }

  async onSucceed(result: AcceptRequestEndpointResult) {
    const embed = new RequestAcceptedEmbed({ profile: result });
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionEndpointError) return;
    if (error instanceof RequestNotFoundEndpointError) return;
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
