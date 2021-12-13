import { ActionWith } from "../base";
import { GetProfilesEndpoint, GetProfilesEndpointParams, GetProfilesEndpointResult } from "endpoints";
import { ErrorEmbed, ProfileListEmbed } from "discord/views";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { basePhrase } from "./phrases";
import { MessageCommandResult, MessageCommandSession } from "./session";

const format = {
  prefixes: [`${basePhrase} show-profile`, `${basePhrase} profile show`],
  arguments: [],
  options: {
    user: {
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
    },
    number: {
      name: "プロフィールの番号",
      description: "",
      type: "integer"
    }
  }
} as const;

export class MessageCommandShowProfilesAction extends ActionWith<MessageCommandEvent, GetProfilesEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: MessageCommandEventContext) {
    await new MessageCommandShowProfilesSession(context, this.endpoint, format).run();
  }
}

const commandTypes = ["specific", "ordered", "random"] as const;
type CommandTypes = typeof commandTypes[number];

function getCommandType(command: MessageCommandResult<typeof format>): CommandTypes {
  if (command.options.number) return "specific";
  if (command.options.order) return "ordered";
  return "random";
}

const commandParamsGetters: Record<
  CommandTypes,
  (context: MessageCommandEventContext, command: MessageCommandResult<typeof format>) => GetProfilesEndpointParams
> = {
  random: (context, command): GetProfilesEndpointParams => {
    return {
      clientDiscordId: context.member.id,
      method: "random",
      ownerDiscordId: command.options.user,
      authorDiscordId: command.options.author,
      content: command.options.content
    };
  },

  specific: (context, command): GetProfilesEndpointParams => {
    if (!command.options.user) throw Error();
    if (!command.options.number) throw Error();
    return {
      clientDiscordId: context.member.id,
      method: "specific",
      ownerDiscordId: command.options.user,
      index: command.options.number
    };
  },

  ordered: (context, command): GetProfilesEndpointParams => {
    const defaultPage = 1;
    const orderTypes = ["random", "latest", "oldest"] as const;
    const order = command.options.order;
    if (order && !(order in orderTypes)) {
      throw Error();
    }

    return {
      clientDiscordId: context.member.id,
      method: (order as "oldest" | "latest" | "random") ?? "random",
      ownerDiscordId: command.options.user,
      authorDiscordId: command.options.author,
      content: command.options.content,
      page: command.options.page ?? defaultPage
    };
  }
} as const;

class MessageCommandShowProfilesSession extends MessageCommandSession<MessageCommandShowProfilesAction, typeof format> {
  async fetch(): Promise<GetProfilesEndpointParams> {
    await Promise.resolve();
    const commandType = getCommandType(this.command);
    return commandParamsGetters[commandType](this.context, this.command);
  }

  async onSucceed(result: GetProfilesEndpointResult) {
    const listEmbed = new ProfileListEmbed({ profiles: result });
    await this.context.message.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
