import { ActionWith } from "../../base";
import { FindRequestEndpoint, EndpointParams, EndpointResult } from "endpoints";
import { ErrorEmbed, RequestListEmbed } from "discord/views";
import { MessageCommandEvent, CreateContext } from "discord/events";
import { basePhrase } from "../phrases";
import { MessageCommandSession } from "../session";

const format = {
  prefixes: [`${basePhrase} show-request`, `${basePhrase} request show`],
  arguments: [
    {
      name: "番号",
      description: "",
      type: "integer"
    }
  ],
  options: {}
} as const;

export class MessageCommandShowRequestAction extends ActionWith<MessageCommandEvent, FindRequestEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: CreateContext) {
    await new Session(context, this.endpoint, format).run();
  }
}

class Session extends MessageCommandSession<MessageCommandShowRequestAction, typeof format> {
  async fetch(): Promise<EndpointParams> {
    await Promise.resolve();

    return {
      clientDiscordId: this.context.member.id,
      index: this.command.arguments[0]
    };
  }

  async onSucceed(result: EndpointResult) {
    const listEmbed = new RequestListEmbed({ requests: [result] });
    await this.context.message.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
