import { GuildMember } from "discord.js";
import { ActionWith } from "../base";
import { SessionIn } from "../session";
import { GetProfilesEndpoint, GetProfilesEndpointParams, GetProfilesEndpointResult } from "endpoints";
import { ErrorEmbed, ProfileListEmbed } from "discord/views";
import { MessageCommandEvent, MessageCommandEventContext, MessageCommandEventOptions } from "discord/events";
import { basePhrase } from "./phrases";

export class MessageCommandShowProfilesAction extends ActionWith<MessageCommandEvent, GetProfilesEndpoint> {
  readonly options: MessageCommandEventOptions = {
    prefixes: [`${basePhrase} show-profile`, `${basePhrase} profile show`],
    allowBot: false
  };

  async onEvent(context: MessageCommandEventContext) {
    await new MessageCommandShowProfilesSession(context, this.endpoint).run();
  }
}

const commandTypes = [
  "user-random",
  "user-number",
  "user-latest",
  "user-oldest",
  "global-random",
  "global-latest",
  "global-oldest"
] as const;

type CommandTypes = typeof commandTypes[number];

function getCommandType(subCommandGroup: string, subCommand: string): CommandTypes {
  if (subCommandGroup === "user" && subCommand === "random") return "user-random";
  if (subCommandGroup === "user" && subCommand === "number") return "user-number";
  if (subCommandGroup === "user" && subCommand === "oldest") return "user-oldest";
  if (subCommandGroup === "user" && subCommand === "latest") return "user-latest";
  if (subCommandGroup === "global" && subCommand === "number") return "global-random";
  if (subCommandGroup === "global" && subCommand === "oldest") return "global-oldest";
  if (subCommandGroup === "global" && subCommand === "latest") return "global-latest";
  throw new Error("Unknown command type: " + `/show-profile ${subCommandGroup} ${subCommand}`);
}

const commandParamsGetters: Record<CommandTypes, (context: MessageCommandEventContext) => GetProfilesEndpointParams> = {
  // /show-profile user random [target: user] [author: user?] [content: string?]
  "user-random": (context): GetProfilesEndpointParams => {
    if (context.arguments.length !== 1) throw new Error();
    return {
      clientDiscordId: context.member.id,
      method: "random",
      ownerDiscordId: context.arguments[0],
      authorDiscordId: context.options["author"],
      content: context.options["content"]
    };
  },

  // /show-profile user number [target: user] [n: integer]
  "user-number": (context): GetProfilesEndpointParams => {
    if (context.arguments.length !== 2) throw new Error();
    return {
      clientDiscordId: context.member.id,
      method: "specific",
      ownerDiscordId: context.arguments[0],
      index: parseInt(context.arguments[1])
    };
  },

  // /show-profile user latest [target: user] [page: integer?] [author: user?] [content: string?]
  "user-latest": (context): GetProfilesEndpointParams => {
    const defaultPage = 1;
    if (context.arguments.length !== 1) throw new Error();
    return {
      clientDiscordId: context.member.id,
      method: "latest",
      ownerDiscordId: context.arguments[0],
      authorDiscordId: context.options["author"],
      content: context.options["content"],
      page: context.options["page"] ? parseInt(context.options["page"]) : defaultPage
    };
  },

  // /show-profile user oldest [target: user] [page: integer?] [author: user?] [content: string?]
  "user-oldest": (context): GetProfilesEndpointParams => {
    const defaultPage = 1;
    if (context.arguments.length !== 1) throw new Error();
    return {
      clientDiscordId: context.member.id,
      method: "oldest",
      ownerDiscordId: context.arguments[0],
      authorDiscordId: context.options["author"],
      content: context.options["content"],
      page: context.options["page"] ? parseInt(context.options["page"]) : defaultPage
    };
  },

  // /show-profile global random [author: user?] [content: string?]
  "global-random": (context): GetProfilesEndpointParams => {
    if (context.arguments.length !== 0) throw new Error();
    return {
      clientDiscordId: context.member.id,
      method: "random",
      authorDiscordId: context.options["author"],
      content: context.options["content"]
    };
  },

  // /show-profile global latest [page: integer?] [author: user?] [content: string?]
  "global-latest": (context): GetProfilesEndpointParams => {
    const defaultPage = 1;
    if (context.arguments.length !== 0) throw new Error();
    return {
      clientDiscordId: context.member.id,
      method: "latest",
      authorDiscordId: context.options["author"],
      content: context.options["content"],
      page: context.options["page"] ? parseInt(context.options["page"]) : defaultPage
    };
  },

  // /show-profile global oldest [page: integer?] [author: user?] [content: string?]
  "global-oldest": (context) => {
    const defaultPage = 1;
    if (context.arguments.length !== 0) throw new Error();
    return {
      clientDiscordId: context.member.id,
      method: "oldest",
      authorDiscordId: context.options["author"],
      content: context.options["content"],
      page: context.options["page"] ? parseInt(context.options["page"]) : defaultPage
    };
  }
} as const;

class MessageCommandShowProfilesSession extends SessionIn<MessageCommandShowProfilesAction> {
  private target!: GuildMember;

  async fetch(): Promise<GetProfilesEndpointParams> {
    await Promise.resolve();
    const subCommandGroup = this.context.interaction.options.getSubcommandGroup(true);
    const subCommand = this.context.interaction.options.getSubcommand(true);
    const commandType = getCommandType(subCommandGroup, subCommand);
    return commandParamsGetters[commandType](this.context);
  }

  async onSucceed(result: GetProfilesEndpointResult) {
    const listEmbed = new ProfileListEmbed({
      elements: result,
      targetName: this.target.displayName,
      targetAvatarURL: this.target.displayAvatarURL()
    });
    await this.context.interaction.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
