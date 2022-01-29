import { Message } from "discord.js";
import { CommandFragments, interpretCommand } from "command-parser";
import { parameterTypes } from "./command";
import {
  mentionUsers,
  RequestAcceptedEmbed,
  RequestCanceledEmbed,
  RequestDeniedEmbed,
  RequestListEmbed,
  RequestSentEmbed
} from "../../views";
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

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "リクエストの番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const profile = await this.endpoints.request.accept(message.author.id, {
      index: interpret.arguments[0]
    });

    const embed = new RequestAcceptedEmbed(profile);
    const mentionableCheck = await this.endpoints.user.checkMentionable(message.author.id, {
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

export class CancelRequestAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "リクエストの番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const request = await this.endpoints.request.cancel(message.author.id, {
      index: interpret.arguments[0]
    });

    const embed = new RequestCanceledEmbed(request);
    await message.reply({ embeds: [embed] });
  }
}

export class DenyRequestAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "リクエストの番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const request = await this.endpoints.request.deny(message.author.id, {
      index: interpret.arguments[0]
    });

    const embed = new RequestDeniedEmbed(request);
    const mentionableCheck = await this.endpoints.user.checkMentionable(message.author.id, {
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

export class SearchRequestAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(message: Message, command: CommandFragments) {
    const defaultPage = 1;
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

    const genre = interpret.options.genre;
    if (genre && genre !== "received" && genre !== "sent") {
      throw new ArgumentFormatInvalidError("genre", "received または sent");
    }

    const order = interpret.options.order;
    if (order && order !== "latest" && order !== "oldest") {
      throw new ArgumentFormatInvalidError("order", "latest または oldest");
    }

    let requests;

    try {
      requests = await this.endpoints.request.search(message.author.id, {
        status: (genre as "received" | "sent" | undefined) ?? "received",
        order: (order as "oldest" | "latest" | undefined) ?? "latest",
        page: interpret.options.page ?? defaultPage,
        targetDiscordId: interpret.options.target,
        applicantDiscordId: interpret.options.applicant,
        content: interpret.options.content
      });
    } catch (error) {
      if (error instanceof ParameterFormatInvalidError && error.key === "page") {
        throw new ArgumentFormatInvalidError("page", "1以上の整数");
      }
      throw error;
    }

    const listEmbed = new RequestListEmbed(requests);
    await message.reply({ embeds: [listEmbed] });
  }
}

export class SendRequestAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [
        { name: "送信先ユーザーのID", type: "userId" },
        { name: "内容", type: "string" }
      ],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const request = await this.endpoints.request.create(message.author.id, {
      targetDiscordId: interpret.arguments[0],
      content: interpret.arguments[1]
    });

    const embed = new RequestSentEmbed({
      index: request.index,
      requesterUserId: message.author.id,
      content: interpret.arguments[1],
      targetUserId: request.targetUserId
    });

    const mentionableCheck = await this.endpoints.user.checkMentionable(message.author.id, {
      targetUsersDiscordId: [request.targetUserId, request.requesterUserId]
    });
    const mentionedUsers = filterMentionable(mentionableCheck);

    const card = await message.reply({
      content: mentionedUsers.length > 0 ? mentionUsers(mentionedUsers) : undefined,
      embeds: [embed],
      allowedMentions: { repliedUser: true, users: mentionedUsers }
    });

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

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const request = await this.endpoints.request.find(message.author.id, {
      index: interpret.arguments[0]
    });

    const listEmbed = new RequestListEmbed([request]);
    await message.reply({ embeds: [listEmbed] });
  }
}
