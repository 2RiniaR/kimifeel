import { Message } from "discord.js";
import { CommandFragments, interpretCommand } from "command-parser";
import { parameterTypes } from "./command";
import { ProfileCreatedEmbed, ProfileDeletedEmbed, ProfileListEmbed } from "../../views";
import { CreateCommandEventAction } from "./base";
import { ArgumentFormatInvalidError } from "../errors";
import { ParameterFormatInvalidError } from "../../../endpoints/errors";
import { Endpoints } from "../endpoints";

export class CreateProfileAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "内容", type: "string" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const profile = await this.endpoints.profile.create(message.author.id, {
      content: interpret.arguments[0]
    });

    const embed = new ProfileCreatedEmbed(profile);
    await message.reply({ embeds: [embed] });
  }
}

export class DeleteProfileAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "プロフィールの番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const profile = await this.endpoints.profile.delete(message.author.id, {
      index: interpret.arguments[0]
    });

    const embed = new ProfileDeletedEmbed(profile);
    await message.reply({ embeds: [embed] });
  }
}

export class RandomProfileAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [],
      options: {
        owner: { name: "対象ユーザーのID", type: "userId" },
        author: { name: "プロフィールを書いたユーザーのID", type: "userId" },
        content: { name: "含まれている文字列", type: "string" }
      }
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const profiles = await this.endpoints.profile.random(message.author.id, {
      ownerDiscordId: interpret.options.owner,
      authorDiscordId: interpret.options.author,
      content: interpret.options.content
    });

    const listEmbed = new ProfileListEmbed(profiles);
    await message.reply({ embeds: [listEmbed] });
  }
}

export class SearchProfileAction extends CreateCommandEventAction {
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
        owner: { name: "対象ユーザーのID", type: "userId" },
        author: { name: "プロフィールを書いたユーザーのID", type: "userId" },
        content: { name: "含まれている文字列", type: "string" },
        page: { name: "ページ", type: "integer" },
        order: { name: "並び替え", type: "string" }
      }
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const order = interpret.options.order;
    if (order && order !== "latest" && order !== "oldest") {
      throw new ArgumentFormatInvalidError("order", "latest または oldest");
    }

    let profiles;

    try {
      profiles = await this.endpoints.profile.search(message.author.id, {
        order: (order as "oldest" | "latest") ?? "latest",
        ownerDiscordId: interpret.options.owner,
        authorDiscordId: interpret.options.author,
        content: interpret.options.content,
        page: interpret.options.page ?? defaultPage
      });
    } catch (error) {
      if (error instanceof ParameterFormatInvalidError && error.key === "page") {
        throw new ArgumentFormatInvalidError("page", "1以上の整数");
      }
      throw error;
    }

    const listEmbed = new ProfileListEmbed(profiles);
    await message.reply({ embeds: [listEmbed] });
  }
}

export class ShowProfileAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "プロフィールの番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const profile = await this.endpoints.profile.find(message.author.id, {
      index: interpret.arguments[0]
    });

    const listEmbed = new ProfileListEmbed([profile]);
    await message.reply({ embeds: [listEmbed] });
  }
}
