import { ActionWith } from "../../base";
import { FindRequestEndpoint, FindRequestEndpointParams, FindRequestEndpointResult } from "endpoints";
import { ErrorEmbed, RequestListEmbed } from "discord/views";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
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
  options: {
    target: {
      name: "リクエスト送信先ユーザーのID",
      description: "",
      type: "userId"
    }
  }
} as const;

export class MessageCommandShowRequestAction extends ActionWith<MessageCommandEvent, FindRequestEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: MessageCommandEventContext) {
    await new Session(context, this.endpoint, format).run();
  }
}

class Session extends MessageCommandSession<MessageCommandShowRequestAction, typeof format> {
  async fetch(): Promise<FindRequestEndpointParams> {
    await Promise.resolve();

    return {
      clientDiscordId: this.context.member.id,
      targetDiscordId: this.command.options.target ?? this.context.member.id,
      index: this.command.arguments[0]
    };
  }

  async onSucceed(result: FindRequestEndpointResult) {
    const listEmbed = new RequestListEmbed({ requests: [result] });
    await this.context.message.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
