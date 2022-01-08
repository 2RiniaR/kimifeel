import {
  ErrorEmbed,
  RequestAcceptedEmbed,
  RequestCanceledEmbed,
  RequestDeniedEmbed,
  RequestListEmbed,
  RequestSentEmbed
} from "discord/views";
import { NoPermissionError, NotFoundError } from "endpoints/errors";
import { RequestEndpoint } from "endpoints/request";
import { CommandInteraction, GuildMember, Message } from "discord.js";
import { DiscordFetchFailedActionError, NoBotActionError } from "../errors";

export class RequestAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    this.endpoint = endpoint;
  }

  async accept(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    let request;
    try {
      request = await this.endpoint.accept(command.user.id, {
        index: number
      });
    } catch (error) {
      if (error instanceof NoPermissionError) return;
      if (error instanceof NotFoundError) return;
      const embed = new ErrorEmbed(error);
      await command.reply({ embeds: [embed] });
      return;
    }

    const embed = new RequestAcceptedEmbed(request);
    await command.reply({ embeds: [embed] });
  }

  async cancel(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    let profile;
    try {
      profile = await this.endpoint.cancel(command.user.id, {
        index: number
      });
    } catch (error) {
      if (error instanceof NoPermissionError) return;
      if (error instanceof NotFoundError) return;
      const embed = new ErrorEmbed(error);
      await command.reply({ embeds: [embed] });
      return;
    }

    const embed = new RequestCanceledEmbed(profile);
    await command.reply({ embeds: [embed] });
  }

  async deny(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    let request;
    try {
      request = await this.endpoint.deny(command.user.id, {
        index: number
      });
    } catch (error) {
      if (error instanceof NoPermissionError) return;
      if (error instanceof NotFoundError) return;
      const embed = new ErrorEmbed(error);
      await command.reply({ embeds: [embed] });
      return;
    }

    const embed = new RequestDeniedEmbed(request);
    await command.reply({ embeds: [embed] });
  }

  async search(command: CommandInteraction) {
    const genre = command.options.getString("genre", false);
    const order = command.options.getString("order", false);
    const page = command.options.getInteger("page", false);
    const content = command.options.getString("content", false);
    const applicant = command.options.getUser("applicant", false);
    const target = command.options.getUser("target", false);

    const defaultPage = 1;
    if (genre && genre !== "received" && genre !== "sent") {
      throw new Error();
    }

    if (order && order !== "latest" && order !== "oldest") {
      throw new Error();
    }

    let requests;
    try {
      requests = await this.endpoint.search(command.user.id, {
        status: (genre as "received" | "sent" | null) ?? "received",
        order: (order as "latest" | "oldest" | null) ?? "latest",
        page: page ?? defaultPage,
        content: content ?? undefined,
        applicantDiscordId: applicant?.id,
        targetDiscordId: target?.id
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await command.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const listEmbed = new RequestListEmbed(requests);
    await command.reply({ embeds: [listEmbed] });
  }

  async send(command: CommandInteraction) {
    const target = command.options.getMember("target", true);
    const content = command.options.getString("content", true);

    if (!(target instanceof GuildMember)) {
      throw new DiscordFetchFailedActionError();
    }

    if (target.user.bot) {
      throw new NoBotActionError();
    }

    let request;
    try {
      request = await this.endpoint.create(command.user.id, {
        targetDiscordId: target.id,
        content: content
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await command.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const embed = new RequestSentEmbed({
      index: request.index,
      requesterUserId: command.user.id,
      content: content,
      targetUserId: target.id
    });

    const message = await command.reply({ embeds: [embed], fetchReply: true });
    if (!(message instanceof Message)) return;

    const emojiCharacters = ["✅", "⛔", "❌"];
    await emojiCharacters.mapAsync((emoji) => message.react(emoji));
  }

  async show(command: CommandInteraction) {
    const index = command.options.getInteger("number", true);

    let request;
    try {
      request = await this.endpoint.find(command.user.id, {
        index
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await command.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const listEmbed = new RequestListEmbed([request]);
    await command.reply({ embeds: [listEmbed] });
  }
}
