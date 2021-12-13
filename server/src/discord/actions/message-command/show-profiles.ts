import { ActionWith } from "../base";
import { SessionIn } from "../session";
import { GetProfilesEndpoint, GetProfilesEndpointParams, GetProfilesEndpointResult } from "endpoints";
import { ErrorEmbed, ProfileListEmbed } from "discord/views";
import { MessageCommandEvent, MessageCommandEventContext, MessageCommandResultOf } from "discord/events";
import { basePhrase } from "./phrases";

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

export class MessageCommandShowProfilesAction extends ActionWith<
  MessageCommandEvent<typeof format>,
  GetProfilesEndpoint
> {
  readonly options = { format, allowBot: false };

  async onEvent(context: MessageCommandEventContext<typeof format>) {
    await new MessageCommandShowProfilesSession(context, this.endpoint).run();
  }
}

const commandTypes = ["specific", "ordered", "random"] as const;

type CommandTypes = typeof commandTypes[number];

function getCommandType(command: MessageCommandResultOf<typeof format>): CommandTypes {
  if (command.options.number) return "specific";
  if (command.options.order) return "ordered";
  return "random";
}

const commandParamsGetters: Record<
  CommandTypes,
  (context: MessageCommandEventContext<typeof format>) => GetProfilesEndpointParams
> = {
  random: (context): GetProfilesEndpointParams => {
    return {
      clientDiscordId: context.member.id,
      method: "random",
      ownerDiscordId: context.command.options.user,
      authorDiscordId: context.command.options.author,
      content: context.command.options.content
    };
  },

  specific: (context): GetProfilesEndpointParams => {
    if (!context.command.options.user) throw Error();
    if (!context.command.options.number) throw Error();
    return {
      clientDiscordId: context.member.id,
      method: "specific",
      ownerDiscordId: context.command.options.user,
      index: context.command.options.number
    };
  },

  ordered: (context): GetProfilesEndpointParams => {
    const defaultPage = 1;
    const orderTypes = ["random", "latest", "oldest"] as const;
    const order = context.command.options.order;
    if (order && !(order in orderTypes)) {
      throw Error();
    }

    return {
      clientDiscordId: context.member.id,
      method: (order as "oldest" | "latest" | "random") ?? "random",
      ownerDiscordId: context.command.options.user,
      authorDiscordId: context.command.options.author,
      content: context.command.options.content,
      page: context.command.options.page ?? defaultPage
    };
  }
} as const;

class MessageCommandShowProfilesSession extends SessionIn<MessageCommandShowProfilesAction> {
  async fetch(): Promise<GetProfilesEndpointParams> {
    await Promise.resolve();
    const commandType = getCommandType(this.context.command);
    return commandParamsGetters[commandType](this.context);
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
