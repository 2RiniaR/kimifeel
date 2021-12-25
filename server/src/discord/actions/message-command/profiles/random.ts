import { ActionWith } from "../../base";
import { RandomProfilesEndpoint, RandomProfilesEndpointParams, RandomProfilesEndpointResult } from "endpoints";
import { ErrorEmbed, ProfileListEmbed } from "discord/views";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { basePhrase } from "../phrases";
import { MessageCommandSession } from "../session";

const format = {
  prefixes: [`${basePhrase} profile random`],
  arguments: [],
  options: {
    owner: {
      name: "対象ユーザーのID",
      description: "",
      type: "userId"
    },
    author: {
      name: "プロフィールを書いたユーザーのID",
      description: "",
      type: "userId"
    },
    content: {
      name: "含まれている文字列",
      description: "",
      type: "string"
    }
  }
} as const;

export class MessageCommandRandomProfilesAction extends ActionWith<MessageCommandEvent, RandomProfilesEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: MessageCommandEventContext) {
    await new Session(context, this.endpoint, format).run();
  }
}

class Session extends MessageCommandSession<MessageCommandRandomProfilesAction, typeof format> {
  async fetch(): Promise<RandomProfilesEndpointParams> {
    await Promise.resolve();

    return {
      clientDiscordId: this.context.member.id,
      ownerDiscordId: this.command.options.owner,
      authorDiscordId: this.command.options.author,
      content: this.command.options.content
    };
  }

  async onSucceed(result: RandomProfilesEndpointResult) {
    const listEmbed = new ProfileListEmbed({ profiles: result });
    await this.context.message.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
