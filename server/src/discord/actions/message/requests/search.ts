import { ActionWith } from "../../base";
import { SearchRequestsEndpoint, EndpointParams, EndpointResult } from "endpoints";
import { ErrorEmbed, RequestListEmbed } from "discord/views";
import { MessageCommandEvent, CreateContext } from "discord/events";
import { basePhrase } from "../phrases";
import { MessageCommandSession } from "../session";

const format = {
  prefixes: [`${basePhrase} request search`],
  arguments: [],
  options: {
    genre: {
      name: "送信済み・受信済み",
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
    },
    applicant: {
      name: "送信元ユーザー",
      description: "",
      type: "userId"
    },
    target: {
      name: "送信先ユーザー",
      description: "",
      type: "userId"
    },
    content: {
      name: "含まれる内容",
      description: "",
      type: "string"
    }
  }
} as const;

export class MessageCommandSearchRequestsAction extends ActionWith<MessageCommandEvent, SearchRequestsEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: CreateContext) {
    await new Session(context, this.endpoint, format).run();
  }
}

class Session extends MessageCommandSession<MessageCommandSearchRequestsAction, typeof format> {
  async fetch(): Promise<EndpointParams> {
    await Promise.resolve();

    const defaultPage = 1;

    const genreTypes = ["received", "sent"] as const;
    const genre = this.command.options.genre;
    if (!genre || !(genre in genreTypes)) {
      throw Error();
    }

    const orderTypes = ["latest", "oldest"] as const;
    const order = this.command.options.order;
    if (!order || !(order in orderTypes)) {
      throw Error();
    }

    return {
      clientDiscordId: this.context.member.id,
      status: genre as "received" | "sent",
      order: order as "oldest" | "latest",
      page: this.command.options.page ?? defaultPage,
      targetDiscordId: this.command.options.target,
      applicantDiscordId: this.command.options.applicant,
      content: this.command.options.content
    };
  }

  async onSucceed(result: EndpointResult) {
    const listEmbed = new RequestListEmbed({ requests: result });
    await this.context.message.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
