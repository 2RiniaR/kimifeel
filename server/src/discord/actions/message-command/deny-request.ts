import { ActionWith } from "../base";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed, RequestDeniedEmbed } from "discord/views";
import { DenyRequestEndpoint, DenyRequestEndpointParams, DenyRequestEndpointResult } from "endpoints";
import { basePhrase } from "./phrases";
import { MessageCommandSession } from "./session";

const format = {
  prefixes: [`${basePhrase} deny-request`, `${basePhrase} request deny`],
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

export class MessageCommandDenyRequestAction extends ActionWith<MessageCommandEvent, DenyRequestEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: MessageCommandEventContext) {
    await new MessageCommandDenyRequestSession(context, this.endpoint, format).run();
  }
}

class MessageCommandDenyRequestSession extends MessageCommandSession<MessageCommandDenyRequestAction, typeof format> {
  async fetch(): Promise<DenyRequestEndpointParams> {
    await Promise.resolve();
    return {
      clientDiscordId: this.context.member.id,
      index: this.command.arguments[0]
    };
  }

  async onSucceed(result: DenyRequestEndpointResult) {
    const embed = new RequestDeniedEmbed({ request: result });
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionEndpointError) return;
    if (error instanceof RequestNotFoundEndpointError) return;
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
