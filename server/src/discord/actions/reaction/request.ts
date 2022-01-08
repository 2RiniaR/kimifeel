import { MessageReaction, User } from "discord.js";
import {
  ErrorEmbed,
  RequestAcceptedEmbed,
  RequestCanceledEmbed,
  RequestDeniedEmbed,
  RequestSentEmbed
} from "discord/views";
import { NoPermissionError, NotFoundError } from "endpoints/errors";
import { RequestEndpoint } from "endpoints/request";
import { DiscordFetchFailedActionError } from "../errors";
import { fetchMessage } from "discord/fetch";

export class RequestAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    this.endpoint = endpoint;
  }

  async accept(reaction: MessageReaction, user: User) {
    const message = await fetchMessage(reaction.message);

    if (message.embeds.length === 0) {
      throw new DiscordFetchFailedActionError();
    }
    const requestEmbed = message.embeds[0];
    const index = RequestSentEmbed.getIndex(requestEmbed);
    if (!index) {
      throw new DiscordFetchFailedActionError();
    }

    let profile;
    try {
      profile = await this.endpoint.accept(user.id, {
        index
      });
    } catch (error) {
      if (error instanceof NoPermissionError) return;
      if (error instanceof NotFoundError) return;
      const embed = new ErrorEmbed(error);
      await message.reply({ embeds: [embed] });
      return;
    }

    const embed = new RequestAcceptedEmbed(profile);
    await message.reply({ embeds: [embed] });
  }

  async cancel(reaction: MessageReaction, user: User) {
    const message = await fetchMessage(reaction.message);

    if (message.embeds.length === 0) {
      throw new DiscordFetchFailedActionError();
    }
    const requestEmbed = message.embeds[0];
    const index = RequestSentEmbed.getIndex(requestEmbed);
    if (!index) {
      throw new DiscordFetchFailedActionError();
    }

    let request;
    try {
      request = await this.endpoint.cancel(user.id, {
        index
      });
    } catch (error) {
      if (error instanceof NoPermissionError) return;
      if (error instanceof NotFoundError) return;
      const embed = new ErrorEmbed(error);
      await message.reply({ embeds: [embed] });
      return;
    }

    const embed = new RequestCanceledEmbed(request);
    await message.reply({ embeds: [embed] });
  }

  async deny(reaction: MessageReaction, user: User) {
    const message = await fetchMessage(reaction.message);

    if (message.embeds.length === 0) {
      throw new DiscordFetchFailedActionError();
    }
    const requestEmbed = message.embeds[0];
    const index = RequestSentEmbed.getIndex(requestEmbed);
    if (!index) {
      throw new DiscordFetchFailedActionError();
    }

    let request;
    try {
      request = await this.endpoint.deny(user.id, {
        index
      });
    } catch (error) {
      if (error instanceof NoPermissionError) return;
      if (error instanceof NotFoundError) return;
      const embed = new ErrorEmbed(error);
      await message.reply({ embeds: [embed] });
      return;
    }

    const embed = new RequestDeniedEmbed(request);
    await message.reply({ embeds: [embed] });
  }
}
