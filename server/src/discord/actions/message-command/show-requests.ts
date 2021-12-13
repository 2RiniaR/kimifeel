import { ActionWith } from "../base";
import { GetRequestsEndpoint, GetRequestsEndpointParams, GetRequestsEndpointResult } from "endpoints";
import { ErrorEmbed, RequestListEmbed } from "discord/views";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { basePhrase } from "./phrases";
import { MessageCommandResult, MessageCommandSession } from "./session";

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

export class MessageCommandShowRequestsAction extends ActionWith<MessageCommandEvent, GetRequestsEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: MessageCommandEventContext) {
    await new MessageCommandShowRequestsSession(context, this.endpoint, format).run();
  }
}

const commandTypes = ["received-specific", "sent-specific", "received-ordered", "sent-ordered"] as const;

type CommandTypes = typeof commandTypes[number];

function getCommandType(command: MessageCommandResult<typeof format>): CommandTypes {
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
  (context: MessageCommandEventContext, command: MessageCommandResult<typeof format>) => GetRequestsEndpointParams
> = {
  "received-specific": (context, command): GetRequestsEndpointParams => {
    if (!command.options.number) throw Error();
    return {
      clientDiscordId: context.member.id,
      genre: "received",
      method: "specific",
      index: command.options.number
    };
  },

  "received-ordered": (context, command): GetRequestsEndpointParams => {
    const defaultPage = 1;
    const orderTypes = ["latest", "oldest"] as const;
    const order = command.options.order;
    if (!order || !(order in orderTypes)) {
      throw Error();
    }

    return {
      clientDiscordId: context.member.id,
      genre: "received",
      method: order as "oldest" | "latest",
      page: command.options.page ?? defaultPage
    };
  },

  "sent-specific": (context, command): GetRequestsEndpointParams => {
    if (!command.options.user) throw Error();
    if (!command.options.number) throw Error();
    return {
      clientDiscordId: context.member.id,
      genre: "sent",
      method: "specific",
      targetDiscordId: command.options.user,
      index: command.options.number
    };
  },

  "sent-ordered": (context, command): GetRequestsEndpointParams => {
    const defaultPage = 1;
    const orderTypes = ["latest", "oldest"] as const;
    const order = command.options.order;
    if (!order || !(order in orderTypes)) {
      throw Error();
    }

    return {
      clientDiscordId: context.member.id,
      genre: "sent",
      method: order as "oldest" | "latest",
      page: command.options.page ?? defaultPage
    };
  }
} as const;

class MessageCommandShowRequestsSession extends MessageCommandSession<MessageCommandShowRequestsAction, typeof format> {
  async fetch(): Promise<GetRequestsEndpointParams> {
    await Promise.resolve();
    const commandType = getCommandType(this.command);
    return commandParamsGetters[commandType](this.context, this.command);
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
