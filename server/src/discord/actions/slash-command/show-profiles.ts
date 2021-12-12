import { GuildMember } from "discord.js";
import { NoBotActionError } from "discord/actions/errors";
import { ActionWith } from "discord/actions/action";
import { GetProfilesEndpoint, GetProfilesEndpointParams, GetProfilesEndpointResult } from "endpoints";
import { ErrorEmbed, ProfileListEmbed } from "discord/views";
import { ActionSessionIn } from "discord/actions/action-session";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";

export class SlashCommandShowProfilesAction extends ActionWith<SlashCommandEvent, GetProfilesEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "show-profile",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new SlashCommandShowProfilesSession(context, this.endpoint).run();
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

const commandParamsGetters: Record<CommandTypes, (context: SlashCommandEventContext) => GetProfilesEndpointParams> = {
  // /show-profile user random [target: user] [author: user?] [content: string?]
  "user-random": (context): GetProfilesEndpointParams => {
    const owner = context.interaction.options.getUser("user", true);
    const author = context.interaction.options.getUser("author", false);
    if (owner.bot || (author && author.bot)) {
      throw new NoBotActionError();
    }
    return {
      clientDiscordId: context.member.id,
      method: "random",
      ownerDiscordId: owner.id,
      authorDiscordId: author?.id,
      content: context.interaction.options.getString("content", false) ?? undefined
    };
  },

  // /show-profile user number [target: user] [n: integer]
  "user-number": (context): GetProfilesEndpointParams => {
    const owner = context.interaction.options.getUser("user", true);
    const author = context.interaction.options.getUser("author", false);
    if (owner.bot || (author && author.bot)) {
      throw new NoBotActionError();
    }
    return {
      clientDiscordId: context.member.id,
      method: "specific",
      ownerDiscordId: owner.id,
      index: context.interaction.options.getInteger("index", true)
    };
  },

  // /show-profile user latest [target: user] [page: integer?] [author: user?] [content: string?]
  "user-latest": (context): GetProfilesEndpointParams => {
    const defaultPage = 1;
    const owner = context.interaction.options.getUser("user", true);
    const author = context.interaction.options.getUser("author", false);
    if (owner.bot || (author && author.bot)) {
      throw new NoBotActionError();
    }
    return {
      clientDiscordId: context.member.id,
      method: "latest",
      ownerDiscordId: owner.id,
      authorDiscordId: author?.id,
      page: context.interaction.options.getInteger("page", false) ?? defaultPage,
      content: context.interaction.options.getString("content", false) ?? undefined
    };
  },

  // /show-profile user oldest [target: user] [page: integer?] [author: user?] [content: string?]
  "user-oldest": (context): GetProfilesEndpointParams => {
    const defaultPage = 1;
    const owner = context.interaction.options.getUser("user", true);
    const author = context.interaction.options.getUser("author", false);
    if (owner.bot || (author && author.bot)) {
      throw new NoBotActionError();
    }
    return {
      clientDiscordId: context.member.id,
      method: "oldest",
      ownerDiscordId: owner.id,
      authorDiscordId: author?.id,
      page: context.interaction.options.getInteger("page", false) ?? defaultPage,
      content: context.interaction.options.getString("content", false) ?? undefined
    };
  },

  // /show-profile global random [author: user?] [content: string?]
  "global-random": (context): GetProfilesEndpointParams => {
    const author = context.interaction.options.getUser("author", false);
    if (author && author.bot) {
      throw new NoBotActionError();
    }
    return {
      clientDiscordId: context.member.id,
      method: "random",
      authorDiscordId: author?.id,
      content: context.interaction.options.getString("content", false) ?? undefined
    };
  },

  // /show-profile global latest [page: integer?] [author: user?] [content: string?]
  "global-latest": (context): GetProfilesEndpointParams => {
    const defaultPage = 1;
    const author = context.interaction.options.getUser("author", false);
    if (author && author.bot) {
      throw new NoBotActionError();
    }
    return {
      clientDiscordId: context.member.id,
      method: "latest",
      authorDiscordId: author?.id,
      page: context.interaction.options.getInteger("page", false) ?? defaultPage,
      content: context.interaction.options.getString("content", false) ?? undefined
    };
  },

  // /show-profile global oldest [page: integer?] [author: user?] [content: string?]
  "global-oldest": (context) => {
    const defaultPage = 1;
    const author = context.interaction.options.getUser("author", false);
    if (author && author.bot) {
      throw new NoBotActionError();
    }
    return {
      clientDiscordId: context.member.id,
      method: "oldest",
      authorDiscordId: author?.id,
      page: context.interaction.options.getInteger("page", false) ?? defaultPage,
      content: context.interaction.options.getString("content", false) ?? undefined
    };
  }
} as const;

class SlashCommandShowProfilesSession extends ActionSessionIn<SlashCommandShowProfilesAction> {
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
