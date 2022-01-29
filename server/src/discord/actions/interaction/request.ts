import {
  mentionUsers,
  RequestAcceptedEmbed,
  RequestCanceledEmbed,
  RequestDeniedEmbed,
  RequestListEmbed,
  RequestSentEmbed
} from "discord/views";
import { CommandInteraction, Message } from "discord.js";
import { CreateCommandEventAction } from "./base";
import { ArgumentFormatInvalidError } from "../errors";
import { ParameterFormatInvalidError } from "../../../endpoints/errors";
import { Endpoints } from "../endpoints";
import { filterMentionable } from "../mention";

export class AcceptRequestAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    const profile = await this.endpoints.request.accept(command.user.id, {
      index: number
    });

    const embed = new RequestAcceptedEmbed(profile);
    const mentionableCheck = await this.endpoints.user.checkMentionable(command.user.id, {
      targetUsersDiscordId: [profile.ownerUserId, profile.authorUserId]
    });
    const mentionedUsers = filterMentionable(mentionableCheck);

    await command.reply({
      content: mentionedUsers.length > 0 ? mentionUsers(mentionedUsers) : undefined,
      embeds: [embed],
      allowedMentions: { repliedUser: true, users: mentionedUsers }
    });
  }
}

export class CancelRequestAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    const request = await this.endpoints.request.cancel(command.user.id, {
      index: number
    });

    const embed = new RequestCanceledEmbed(request);
    await command.reply({ embeds: [embed] });
  }
}

export class DenyRequestAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    const request = await this.endpoints.request.deny(command.user.id, {
      index: number
    });

    const embed = new RequestDeniedEmbed(request);
    const mentionableCheck = await this.endpoints.user.checkMentionable(command.user.id, {
      targetUsersDiscordId: [request.targetUserId, request.requesterUserId]
    });
    const mentionedUsers = filterMentionable(mentionableCheck);

    await command.reply({
      content: mentionedUsers.length > 0 ? mentionUsers(mentionedUsers) : undefined,
      embeds: [embed],
      allowedMentions: { repliedUser: true, users: mentionedUsers }
    });
  }
}

export class SearchRequestAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(command: CommandInteraction) {
    const defaultPage = 1;
    const genre = command.options.getString("genre", false);
    const order = command.options.getString("order", false);
    const page = command.options.getInteger("page", false);
    const content = command.options.getString("content", false);
    const applicant = command.options.getUser("applicant", false);
    const target = command.options.getUser("target", false);

    if (genre && genre !== "received" && genre !== "sent") {
      throw new ArgumentFormatInvalidError("genre", "received または sent");
    }

    if (order && order !== "latest" && order !== "oldest") {
      throw new ArgumentFormatInvalidError("order", "latest または oldest");
    }

    let requests;
    try {
      requests = await this.endpoints.request.search(command.user.id, {
        status: (genre as "received" | "sent" | null) ?? "received",
        order: (order as "latest" | "oldest" | null) ?? "latest",
        page: page ?? defaultPage,
        content: content ?? undefined,
        applicantDiscordId: applicant?.id,
        targetDiscordId: target?.id
      });
    } catch (error) {
      if (error instanceof ParameterFormatInvalidError && error.key === "page") {
        throw new ArgumentFormatInvalidError("page", "0以上の整数");
      }
      throw error;
    }

    const listEmbed = new RequestListEmbed(requests);
    await command.reply({ embeds: [listEmbed], ephemeral: true });
  }
}

export class SendRequestAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(command: CommandInteraction) {
    const target = command.options.getUser("target", true);
    const content = command.options.getString("content", true);

    const request = await this.endpoints.request.create(command.user.id, {
      targetDiscordId: target.id,
      content: content
    });

    const embed = new RequestSentEmbed({
      index: request.index,
      requesterUserId: command.user.id,
      content: content,
      targetUserId: target.id
    });

    const mentionableCheck = await this.endpoints.user.checkMentionable(command.user.id, {
      targetUsersDiscordId: [request.targetUserId, request.requesterUserId]
    });
    const mentionedUsers = filterMentionable(mentionableCheck);

    const card = await command.reply({
      content: mentionedUsers.length > 0 ? mentionUsers(mentionedUsers) : undefined,
      embeds: [embed],
      fetchReply: true,
      allowedMentions: { repliedUser: true, users: mentionedUsers }
    });
    if (!(card instanceof Message)) return;

    const emojiCharacters = ["✅", "⛔", "❌"];
    await emojiCharacters.mapAsync((emoji) => card.react(emoji));
  }
}

export class ShowRequestAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(command: CommandInteraction) {
    const index = command.options.getInteger("number", true);

    const request = await this.endpoints.request.find(command.user.id, {
      index
    });

    const listEmbed = new RequestListEmbed([request]);
    await command.reply({ embeds: [listEmbed], ephemeral: true });
  }
}
