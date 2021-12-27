import { ActionWith } from "../../base";
import { FindProfilesEndpoint, FindProfileEndpointParams, FindProfilesEndpointResult } from "endpoints";
import { ErrorEmbed, ProfileListEmbed } from "discord/views";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { basePhrase } from "../phrases";
import { MessageCommandSession } from "../session";

const format = {
  prefixes: [`${basePhrase} profile show`],
  arguments: [
    {
      name: "プロフィールの番号",
      description: "",
      type: "integer"
    }
  ],
  options: {}
} as const;

export class MessageCommandShowProfileAction extends ActionWith<MessageCommandEvent, FindProfilesEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: MessageCommandEventContext) {
    await new Session(context, this.endpoint, format).run();
  }
}

class Session extends MessageCommandSession<MessageCommandShowProfileAction, typeof format> {
  async fetch(): Promise<FindProfileEndpointParams> {
    await Promise.resolve();
    if (!this.command.arguments[0]) throw Error();

    return {
      clientDiscordId: this.context.member.id,
      index: this.command.arguments[0]
    };
  }

  async onSucceed(result: FindProfilesEndpointResult) {
    const listEmbed = new ProfileListEmbed({ profiles: [result] });
    await this.context.message.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
