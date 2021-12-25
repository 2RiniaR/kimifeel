import { ActionWith } from "../../base";
import { SearchProfilesEndpoint, SearchProfilesEndpointParams, SearchProfilesEndpointResult } from "endpoints";
import { ErrorEmbed, ProfileListEmbed } from "discord/views";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { basePhrase } from "../phrases";
import { MessageCommandSession } from "../session";

const format = {
  prefixes: [`${basePhrase} profile search`],
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
    },
    page: {
      name: "ページ",
      description: "",
      type: "integer"
    },
    order: {
      name: "並び替え",
      description: "",
      type: "string"
    }
  }
} as const;

export class MessageCommandSearchProfilesAction extends ActionWith<MessageCommandEvent, SearchProfilesEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: MessageCommandEventContext) {
    await new Session(context, this.endpoint, format).run();
  }
}

class Session extends MessageCommandSession<MessageCommandSearchProfilesAction, typeof format> {
  async fetch(): Promise<SearchProfilesEndpointParams> {
    await Promise.resolve();

    const defaultPage = 1;
    const orderTypes = ["latest", "oldest"] as const;
    const order = this.command.options.order;
    if (order && !(order in orderTypes)) {
      throw Error();
    }

    return {
      clientDiscordId: this.context.member.id,
      order: (order as "oldest" | "latest") ?? "latest",
      ownerDiscordId: this.command.options.owner,
      authorDiscordId: this.command.options.author,
      content: this.command.options.content,
      page: this.command.options.page ?? defaultPage
    };
  }

  async onSucceed(result: SearchProfilesEndpointResult) {
    const listEmbed = new ProfileListEmbed({ profiles: result });
    await this.context.message.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
