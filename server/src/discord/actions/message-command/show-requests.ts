import { ActionWith } from "../base";
import { SessionIn } from "../session";
import { GetRequestsEndpoint, GetRequestsEndpointParams, GetRequestsEndpointResult } from "endpoints";
import { ErrorEmbed, RequestListEmbed } from "discord/views";
import { MessageCommandEvent, MessageCommandEventContext, MessageCommandResultOf } from "discord/events";
import { basePhrase } from "./phrases";

const format = {
  prefixes: [`${basePhrase} show-request`, `${basePhrase} request show`],
  arguments: [
    {
      name: "送信済みか受信済みか",
      description: "",
      type: "string"
    }
  ],
  options: {
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
    number: {
      name: "リクエストの番号",
      description: "",
      type: "integer"
    },
    user: {
      name: "リクエスト送信先ユーザーのID",
      description: "",
      type: "userId"
    }
  }
} as const;

export class MessageCommandShowRequestsAction extends ActionWith<
  MessageCommandEvent<typeof format>,
  GetRequestsEndpoint
> {
  readonly options = { format, allowBot: false };

  async onEvent(context: MessageCommandEventContext<typeof format>) {
    await new MessageCommandShowRequestsSession(context, this.endpoint).run();
  }
}

const commandTypes = ["received-specific", "sent-specific", "received-ordered", "sent-ordered"] as const;

type CommandTypes = typeof commandTypes[number];

function getCommandType(command: MessageCommandResultOf<typeof format>): CommandTypes {
  if (command.arguments[0] === "received") {
    if (command.options.order) return "received-ordered";
    else return "received-specific";
  } else if (command.arguments[0] === "sent") {
    if (command.options.order) return "sent-ordered";
    else return "sent-specific";
  }
  throw new Error();
}

const commandParamsGetters: Record<
  CommandTypes,
  (context: MessageCommandEventContext<typeof format>) => GetRequestsEndpointParams
> = {
  "received-specific": (context): GetRequestsEndpointParams => {
    if (!context.command.options.number) throw Error();
    return {
      clientDiscordId: context.member.id,
      genre: "received",
      method: "specific",
      index: context.command.options.number
    };
  },

  "received-ordered": (context): GetRequestsEndpointParams => {
    const defaultPage = 1;
    const orderTypes = ["latest", "oldest"] as const;
    const order = context.command.options.order;
    if (!order || !(order in orderTypes)) {
      throw Error();
    }

    return {
      clientDiscordId: context.member.id,
      genre: "received",
      method: order as "oldest" | "latest",
      page: context.command.options.page ?? defaultPage
    };
  },

  "sent-specific": (context): GetRequestsEndpointParams => {
    if (!context.command.options.user) throw Error();
    if (!context.command.options.number) throw Error();
    return {
      clientDiscordId: context.member.id,
      genre: "sent",
      method: "specific",
      targetDiscordId: context.command.options.user,
      index: context.command.options.number
    };
  },

  "sent-ordered": (context): GetRequestsEndpointParams => {
    const defaultPage = 1;
    const orderTypes = ["latest", "oldest"] as const;
    const order = context.command.options.order;
    if (!order || !(order in orderTypes)) {
      throw Error();
    }

    return {
      clientDiscordId: context.member.id,
      genre: "sent",
      method: order as "oldest" | "latest",
      page: context.command.options.page ?? defaultPage
    };
  }
} as const;

class MessageCommandShowRequestsSession extends SessionIn<MessageCommandShowRequestsAction> {
  async fetch(): Promise<GetRequestsEndpointParams> {
    await Promise.resolve();
    const commandType = getCommandType(this.context.command);
    return commandParamsGetters[commandType](this.context);
  }

  async onSucceed(result: GetRequestsEndpointResult) {
    const listEmbed = new RequestListEmbed({ requests: result });
    await this.context.message.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
