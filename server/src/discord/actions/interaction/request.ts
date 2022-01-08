import {
  RequestAcceptedEmbed,
  RequestCanceledEmbed,
  RequestDeniedEmbed,
  RequestListEmbed,
  RequestSentEmbed
} from "discord/views";
import { RequestEndpoint } from "endpoints/request";
import { CommandInteraction, Message } from "discord.js";
import { CreateCommandEventAction } from "./base";
import { ParameterFormatInvalidError } from "../errors";

export class AcceptRequestAction extends CreateCommandEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    const request = await this.endpoint.accept(command.user.id, {
      index: number
    });

    const embed = new RequestAcceptedEmbed(request);
    await command.reply({ embeds: [embed] });
  }
}

export class CancelRequestAction extends CreateCommandEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    const profile = await this.endpoint.cancel(command.user.id, {
      index: number
    });

    const embed = new RequestCanceledEmbed(profile);
    await command.reply({ embeds: [embed] });
  }
}

export class DenyRequestAction extends CreateCommandEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    const request = await this.endpoint.deny(command.user.id, {
      index: number
    });

    const embed = new RequestDeniedEmbed(request);
    await command.reply({ embeds: [embed] });
  }
}

export class SearchRequestAction extends CreateCommandEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
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
      throw new ParameterFormatInvalidError("genre", "received または sent");
    }

    if (order && order !== "latest" && order !== "oldest") {
      throw new ParameterFormatInvalidError("order", "latest または oldest");
    }

    const requests = await this.endpoint.search(command.user.id, {
      status: (genre as "received" | "sent" | null) ?? "received",
      order: (order as "latest" | "oldest" | null) ?? "latest",
      page: page ?? defaultPage,
      content: content ?? undefined,
      applicantDiscordId: applicant?.id,
      targetDiscordId: target?.id
    });

    const listEmbed = new RequestListEmbed(requests);
    await command.reply({ embeds: [listEmbed] });
  }
}

export class SendRequestAction extends CreateCommandEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(command: CommandInteraction) {
    const target = command.options.getUser("target", true);
    const content = command.options.getString("content", true);

    const request = await this.endpoint.create(command.user.id, {
      targetDiscordId: target.id,
      content: content
    });

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
}

export class ShowRequestAction extends CreateCommandEventAction {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(command: CommandInteraction) {
    const index = command.options.getInteger("number", true);

    const request = await this.endpoint.find(command.user.id, {
      index
    });

    const listEmbed = new RequestListEmbed([request]);
    await command.reply({ embeds: [listEmbed] });
  }
}
