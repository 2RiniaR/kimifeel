import { ErrorEmbed, ProfileDeletedEmbed } from "discord/views";
import { CreateContext, MessageCommandEvent } from "discord/events";
import { ActionWith } from "../../base";
import { DeleteProfileEndpoint, EndpointParams, EndpointResult } from "endpoints";
import { basePhrase } from "../phrases";
import { MessageCommandSession } from "../session";

const format = {
  prefixes: [`${basePhrase} profile delete`],
  arguments: [
    {
      name: "プロフィールの番号",
      description: "",
      type: "integer"
    }
  ],
  options: {}
} as const;

export class MessageCommandDeleteProfileAction extends ActionWith<MessageCommandEvent, DeleteProfileEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: CreateContext) {
    await new Session(context, this.endpoint, format).run();
  }
}

class Session extends MessageCommandSession<MessageCommandDeleteProfileAction, typeof format> {
  async fetch(): Promise<EndpointParams> {
    await Promise.resolve();

    return {
      clientDiscordId: this.context.member.id,
      index: this.command.arguments[0]
    };
  }

  async onSucceed(result: EndpointResult) {
    const embed = new ProfileDeletedEmbed({ profile: result });
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
