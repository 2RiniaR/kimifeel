import { SessionIn } from "../session";
import { ActionWith } from "../base";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed, RequestAcceptedEmbed } from "discord/views";
import { AcceptRequestEndpoint, AcceptRequestEndpointParams, AcceptRequestEndpointResult } from "endpoints";
import { basePhrase } from "./phrases";

const format = {
  prefixes: [`${basePhrase} accpet-request`, `${basePhrase} request accept`],
  arguments: [
    {
      name: "リクエストの番号",
      description: "",
      type: "integer"
    }
  ],
  options: {}
} as const;

export class MessageCommandAcceptRequestAction extends ActionWith<
  MessageCommandEvent<typeof format>,
  AcceptRequestEndpoint
> {
  readonly options = { format, allowBot: false };

  async onEvent(context: MessageCommandEventContext<typeof format>) {
    await new MessageCommandAcceptRequestSession(context, this.endpoint).run();
  }
}

class MessageCommandAcceptRequestSession extends SessionIn<MessageCommandAcceptRequestAction> {
  async fetch(): Promise<AcceptRequestEndpointParams> {
    await Promise.resolve();
    return {
      clientDiscordId: this.context.member.id,
      index: this.context.command.arguments[0]
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
