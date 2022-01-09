import { Message, MessageReaction, User } from "discord.js";
import { RequestAcceptedEmbed, RequestCanceledEmbed, RequestDeniedEmbed, RequestSentEmbed } from "discord/views";
import { RequestEndpoint } from "endpoints/request";
import { AddEventAction } from "./base";

export class AcceptRequestAction extends AddEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
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

    const profile = await this.endpoint.accept(user.id, {
      index
    });

    const embed = new RequestAcceptedEmbed(profile);
    await message.reply({ embeds: [embed] });
  }
}

export class CancelRequestAction extends AddEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
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

    const result = await this.endpoint.cancel(user.id, {
      index
    });

    const embed = new RequestCanceledEmbed(result);
    await message.reply({ embeds: [embed] });
  }
}

export class DenyRequestAction extends AddEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
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

    const result = await this.endpoint.deny(user.id, {
      index
    });

    const embed = new RequestDeniedEmbed(result);
    await message.reply({ embeds: [embed] });
  }
}
