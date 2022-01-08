import { Message } from "discord.js";
import { CommandFragments, interpretCommand } from "command-parser";
import { RequestEndpoint } from "endpoints/request";
import { parameterTypes } from "./command";
import { NoPermissionError, NotFoundError } from "endpoints/errors";
import {
  ErrorEmbed,
  RequestAcceptedEmbed,
  RequestCanceledEmbed,
  RequestDeniedEmbed,
  RequestListEmbed,
  RequestSentEmbed
} from "../../views";

export class RequestAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    this.endpoint = endpoint;
  }

  async accept(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "リクエストの番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    let request;
    try {
      request = await this.endpoint.accept(message.author.id, {
        index: interpret.arguments[0]
      });
    } catch (error) {
      if (error instanceof NoPermissionError) return;
      if (error instanceof NotFoundError) return;
      const embed = new ErrorEmbed(error);
      await message.reply({ embeds: [embed] });
      return;
    }

    const embed = new RequestAcceptedEmbed(request);
    await message.reply({ embeds: [embed] });
  }

  async cancel(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "リクエストの番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    let profile;
    try {
      profile = await this.endpoint.cancel(message.author.id, {
        index: interpret.arguments[0]
      });
    } catch (error) {
      if (error instanceof NoPermissionError) return;
      if (error instanceof NotFoundError) return;
      const embed = new ErrorEmbed(error);
      await message.reply({ embeds: [embed] });
      return;
    }

    const embed = new RequestCanceledEmbed(profile);
    await message.reply({ embeds: [embed] });
  }

  async deny(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "リクエストの番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    let request;
    try {
      request = await this.endpoint.deny(message.author.id, {
        index: interpret.arguments[0]
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

  async search(message: Message, command: CommandFragments) {
    const format = {
      arguments: [],
      options: {
        genre: { name: "送信済み・受信済み", type: "string" },
        page: { name: "ページ", type: "integer" },
        order: { name: "並び替え", type: "string" },
        applicant: { name: "送信元ユーザー", type: "userId" },
        target: { name: "送信先ユーザー", type: "userId" },
        content: { name: "含まれる内容", type: "string" }
      }
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const defaultPage = 1;

    const genreTypes = ["received", "sent"] as const;
    const genre = interpret.options.genre;
    if (!genre || !(genre in genreTypes)) {
      throw Error();
    }

    const orderTypes = ["latest", "oldest"] as const;
    const order = interpret.options.order;
    if (!order || !(order in orderTypes)) {
      throw Error();
    }

    let requests;
    try {
      requests = await this.endpoint.search(message.author.id, {
        status: genre as "received" | "sent",
        order: order as "oldest" | "latest",
        page: interpret.options.page ?? defaultPage,
        targetDiscordId: interpret.options.target,
        applicantDiscordId: interpret.options.applicant,
        content: interpret.options.content
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await message.reply({ embeds: [embed] });
      return;
    }

    const listEmbed = new RequestListEmbed(requests);
    await message.reply({ embeds: [listEmbed] });
  }

  async send(message: Message, command: CommandFragments) {
    const format = {
      arguments: [
        { name: "送信先ユーザーのID", type: "userId" },
        { name: "内容", type: "string" }
      ],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    let request;
    try {
      request = await this.endpoint.create(message.author.id, {
        targetDiscordId: interpret.arguments[0],
        content: interpret.arguments[1]
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await message.reply({ embeds: [embed] });
      return;
    }

    const embed = new RequestSentEmbed({
      index: request.index,
      requesterUserId: message.author.id,
      content: interpret.arguments[1],
      targetUserId: request.targetUserId
    });

    const card = await message.reply({ embeds: [embed] });

    const emojiCharacters = ["✅", "⛔", "❌"];
    await emojiCharacters.mapAsync((emoji) => card.react(emoji));
  }

  async show(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    let request;
    try {
      request = await this.endpoint.find(message.author.id, {
        index: interpret.arguments[0]
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await message.reply({ embeds: [embed] });
      return;
    }

    const listEmbed = new RequestListEmbed([request]);
    await message.reply({ embeds: [listEmbed] });
  }
}
