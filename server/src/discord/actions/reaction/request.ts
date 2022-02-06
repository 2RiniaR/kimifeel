import { Message, MessageReaction, User } from "discord.js";
import {
  mentionUsers,
  RequestAcceptedEmbed,
  RequestCanceledEmbed,
  RequestDeniedEmbed,
  RequestSentEmbed
} from "discord/views";
import { AddEventAction } from "./base";
import { RequestNotFoundError } from "../../../app/endpoints/errors";
import { Endpoints } from "../endpoints";
import { filterMentionable } from "../mention";

export class AcceptRequestAction extends AddEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(reaction: MessageReaction, user: User, message: Message) {
    if (message.embeds.length === 0) {
      return;
    }

    const requestEmbed = message.embeds[0];
    const index = RequestSentEmbed.getIndex(requestEmbed);
    if (!index) {
      return;
    }

    let profile;
    try {
      profile = await this.endpoints.request.accept(user.id, {
        index
      });
    } catch (error) {
      if (error instanceof RequestNotFoundError) return;
      throw error;
    }

    const embed = new RequestAcceptedEmbed(profile);
    const mentionableCheck = await this.endpoints.user.checkMentionable(user.id, {
      targetUsersDiscordId: [profile.ownerUserId, profile.authorUserId]
    });
    const mentionedUsers = filterMentionable(mentionableCheck);

    await message.reply({
      content: mentionedUsers.length > 0 ? mentionUsers(mentionedUsers) : undefined,
      embeds: [embed],
      allowedMentions: { repliedUser: true, users: mentionedUsers }
    });
  }
}

export class CancelRequestAction extends AddEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(reaction: MessageReaction, user: User, message: Message) {
    if (message.embeds.length === 0) {
      return;
    }

    const requestEmbed = message.embeds[0];
    const index = RequestSentEmbed.getIndex(requestEmbed);
    if (!index) {
      return;
    }

    let request;
    try {
      request = await this.endpoints.request.cancel(user.id, {
        index
      });
    } catch (error) {
      if (error instanceof RequestNotFoundError) return;
      throw error;
    }

    const embed = new RequestCanceledEmbed(request);
    await message.reply({ embeds: [embed] });
  }
}

export class DenyRequestAction extends AddEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(reaction: MessageReaction, user: User, message: Message) {
    if (message.embeds.length === 0) {
      return;
    }

    const requestEmbed = message.embeds[0];
    const index = RequestSentEmbed.getIndex(requestEmbed);
    if (!index) {
      return;
    }

    let request;
    try {
      request = await this.endpoints.request.deny(user.id, {
        index
      });
    } catch (error) {
      if (error instanceof RequestNotFoundError) return;
      throw error;
    }

    const embed = new RequestDeniedEmbed(request);
    const mentionableCheck = await this.endpoints.user.checkMentionable(user.id, {
      targetUsersDiscordId: [request.targetUserId, request.requesterUserId]
    });
    const mentionedUsers = filterMentionable(mentionableCheck);

    await message.reply({
      content: mentionedUsers.length > 0 ? mentionUsers(mentionedUsers) : undefined,
      embeds: [embed],
      allowedMentions: { repliedUser: true, users: mentionedUsers }
    });
  }
}
