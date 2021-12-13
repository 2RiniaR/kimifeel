import { NoBotActionError } from "../errors";
import { ActionWith } from "../base";
import { SessionIn } from "../session";
import { GetRequestsEndpoint, GetRequestsEndpointParams, GetRequestsEndpointResult } from "endpoints";
import { ErrorEmbed, ProfileListEmbed } from "discord/views";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";

export class SlashCommandShowRequestsAction extends ActionWith<SlashCommandEvent, GetRequestsEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "show-request",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new SlashCommandShowRequestsSession(context, this.endpoint).run();
  }
}

const commandTypes = [
  "received-number",
  "received-latest",
  "received-oldest",
  "sent-number",
  "sent-latest",
  "sent-oldest"
] as const;

type CommandTypes = typeof commandTypes[number];

function getCommandType(subCommandGroup: string, subCommand: string): CommandTypes {
  if (subCommandGroup === "received" && subCommand === "number") return "received-number";
  if (subCommandGroup === "received" && subCommand === "oldest") return "received-oldest";
  if (subCommandGroup === "received" && subCommand === "latest") return "received-latest";
  if (subCommandGroup === "sent" && subCommand === "number") return "sent-number";
  if (subCommandGroup === "sent" && subCommand === "oldest") return "sent-oldest";
  if (subCommandGroup === "sent" && subCommand === "latest") return "sent-latest";
  throw new Error("Unknown command type: " + `/show-request ${subCommandGroup} ${subCommand}`);
}

const commandParamsGetters: Record<CommandTypes, (context: SlashCommandEventContext) => GetRequestsEndpointParams> = {
  // /show-request received number [n: integer]
  "received-number": (context): GetRequestsEndpointParams => {
    return {
      clientDiscordId: context.member.id,
      genre: "received",
      method: "specific",
      index: context.interaction.options.getInteger("index", true)
    };
  },

  // /show-request received latest [page: integer?]
  "received-latest": (context): GetRequestsEndpointParams => {
    const defaultPage = 1;
    return {
      clientDiscordId: context.member.id,
      genre: "received",
      method: "latest",
      page: context.interaction.options.getInteger("page", false) ?? defaultPage
    };
  },

  // /show-request oldest [page: integer?]
  "received-oldest": (context): GetRequestsEndpointParams => {
    const defaultPage = 1;
    return {
      clientDiscordId: context.member.id,
      genre: "received",
      method: "oldest",
      page: context.interaction.options.getInteger("page", false) ?? defaultPage
    };
  },

  // /show-request sent number [target: user] [n: integer]
  "sent-number": (context): GetRequestsEndpointParams => {
    const target = context.interaction.options.getUser("target", true);
    if (target.bot) {
      throw new NoBotActionError();
    }

    return {
      clientDiscordId: context.member.id,
      genre: "sent",
      method: "specific",
      index: context.interaction.options.getInteger("index", true),
      targetDiscordId: target.id
    };
  },

  // /show-request sent latest [page: integer?]
  "sent-latest": (context): GetRequestsEndpointParams => {
    const defaultPage = 1;
    return {
      clientDiscordId: context.member.id,
      genre: "sent",
      method: "latest",
      page: context.interaction.options.getInteger("page", false) ?? defaultPage
    };
  },

  // /show-request oldest [page: integer?]
  "sent-oldest": (context): GetRequestsEndpointParams => {
    const defaultPage = 1;
    return {
      clientDiscordId: context.member.id,
      genre: "sent",
      method: "oldest",
      page: context.interaction.options.getInteger("page", false) ?? defaultPage
    };
  }
} as const;

class SlashCommandShowRequestsSession extends SessionIn<SlashCommandShowRequestsAction> {
  async fetch(): Promise<GetRequestsEndpointParams> {
    await Promise.resolve();
    const subCommandGroup = this.context.interaction.options.getSubcommandGroup(true);
    const subCommand = this.context.interaction.options.getSubcommand(true);
    const commandType = getCommandType(subCommandGroup, subCommand);
    return commandParamsGetters[commandType](this.context);
  }

  async onSucceed(result: GetRequestsEndpointResult) {
    const listEmbed = new ProfileListEmbed({ profiles: result });
    await this.context.interaction.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
