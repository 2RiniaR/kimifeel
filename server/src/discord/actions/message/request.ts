import { Message } from "discord.js";
import { CommandFragments, interpretCommand } from "command-parser";
import { RequestEndpoint } from "endpoints/request";
import { parameterTypes } from "./command";
import {
  RequestAcceptedEmbed,
  RequestCanceledEmbed,
  RequestDeniedEmbed,
  RequestListEmbed,
  RequestSentEmbed
} from "../../views";
import { CreateCommandEventAction } from "./base";
import { ParameterFormatInvalidError } from "../errors";

export class AcceptRequestAction extends CreateCommandEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "リクエストの番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const request = await this.endpoint.accept(message.author.id, {
      index: interpret.arguments[0]
    });

    const embed = new RequestAcceptedEmbed(request);
    await message.reply({ embeds: [embed] });
  }
}

export class CancelRequestAction extends CreateCommandEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "リクエストの番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const profile = await this.endpoint.cancel(message.author.id, {
      index: interpret.arguments[0]
    });

    const embed = new RequestCanceledEmbed(profile);
    await message.reply({ embeds: [embed] });
  }
}

export class DenyRequestAction extends CreateCommandEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "リクエストの番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const request = await this.endpoint.deny(message.author.id, {
      index: interpret.arguments[0]
    });

    const embed = new RequestDeniedEmbed(request);
    await message.reply({ embeds: [embed] });
  }
}

export class SearchRequestAction extends CreateCommandEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
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

    const genreTypes = ["received", "sent"] as const;
    const genre = interpret.options.genre;
    if (!genre || !(genre in genreTypes)) {
      throw new ParameterFormatInvalidError("genre", "received または sent");
    }

    const orderTypes = ["latest", "oldest"] as const;
    const order = interpret.options.order;
    if (!order || !(order in orderTypes)) {
      throw new ParameterFormatInvalidError("order", "latest または oldest");
    }

    const requests = await this.endpoint.search(message.author.id, {
      status: genre as "received" | "sent",
      order: order as "oldest" | "latest",
      page: interpret.options.page ?? defaultPage,
      targetDiscordId: interpret.options.target,
      applicantDiscordId: interpret.options.applicant,
      content: interpret.options.content
    });

    const listEmbed = new RequestListEmbed(requests);
    await message.reply({ embeds: [listEmbed] });
  }
}

export class SendRequestAction extends CreateCommandEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
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

    const request = await this.endpoint.create(message.author.id, {
      targetDiscordId: interpret.arguments[0],
      content: interpret.arguments[1]
    });

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
}

export class ShowRequestAction extends CreateCommandEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const request = await this.endpoint.find(message.author.id, {
      index: interpret.arguments[0]
    });

    const listEmbed = new RequestListEmbed([request]);
    await message.reply({ embeds: [listEmbed] });
  }
}
