import { ProfileCreatedEmbed, ProfileDeletedEmbed, ProfileListEmbed } from "discord/views";
import { CommandInteraction } from "discord.js";
import { CreateCommandEventAction } from "./base";
import { ArgumentFormatInvalidError } from "../errors";
import { ParameterFormatInvalidError } from "app/endpoints/errors";
import { Endpoints } from "../endpoints";

export class ProfileAction {
  public async create(command: CommandInteraction) {
    const content = command.options.getString("content", true);

    const profile = await this.endpoints.profile.create(command.user.id, {
      content
    });

    const embed = new ProfileCreatedEmbed(profile);
    await command.reply({ embeds: [embed] });
  }
}

export class DeleteProfileAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    const profile = await this.endpoints.profile.delete(command.user.id, {
      index: number
    });

    const embed = new ProfileDeletedEmbed(profile);
    await command.reply({ embeds: [embed] });
  }
}

export class RandomProfileAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(command: CommandInteraction) {
    const owner = command.options.getUser("owner", false);
    const author = command.options.getUser("author", false);
    const content = command.options.getString("content", false);

    const profiles = await this.endpoints.profile.random(command.user.id, {
      ownerDiscordId: owner?.id,
      authorDiscordId: author?.id,
      content: content ?? undefined
    });

    console.log(profiles);

    const listEmbed = new ProfileListEmbed(profiles);
    await command.reply({ embeds: [listEmbed] });
  }
}

export class SearchProfileAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(command: CommandInteraction) {
    const defaultPage = 1;
    const order = command.options.getString("order", false);
    const owner = command.options.getUser("owner", false);
    const author = command.options.getUser("author", false);
    const page = command.options.getInteger("page", false);
    const content = command.options.getString("content", false);

    if (order && order !== "latest" && order !== "oldest") {
      throw new ArgumentFormatInvalidError("order", "latest または oldest");
    }

    let profiles;
    try {
      profiles = await this.endpoints.profile.search(command.user.id, {
        order: (order as "latest" | "oldest" | null) ?? "latest",
        ownerDiscordId: owner?.id,
        authorDiscordId: author?.id,
        page: page ?? defaultPage,
        content: content ?? undefined
      });
    } catch (error) {
      if (error instanceof ParameterFormatInvalidError && error.key === "page") {
        throw new ArgumentFormatInvalidError("page", "0以上の整数");
      }
      throw error;
    }

    const listEmbed = new ProfileListEmbed(profiles);
    await command.reply({ embeds: [listEmbed] });
  }
}

export class ShowProfileAction extends CreateCommandEventAction {
  private readonly endpoints: Endpoints;

  constructor(endpoints: Endpoints) {
    super();
    this.endpoints = endpoints;
  }

  async run(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    const profile = await this.endpoints.profile.find(command.user.id, {
      index: number
    });

    const listEmbed = new ProfileListEmbed([profile]);
    await command.reply({ embeds: [listEmbed] });
  }
}
