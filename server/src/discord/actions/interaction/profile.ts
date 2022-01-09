import { ProfileDeletedEmbed, ProfileListEmbed } from "discord/views";
import { ProfileEndpoint } from "endpoints/profile";
import { CommandInteraction } from "discord.js";
import { CreateCommandEventAction } from "./base";
import { ParameterFormatInvalidError } from "../errors";

export class DeleteProfileAction extends CreateCommandEventAction {
  private readonly endpoint: ProfileEndpoint;

  constructor(endpoint: ProfileEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    const profile = await this.endpoint.delete(command.user.id, {
      index: number
    });

    const embed = new ProfileDeletedEmbed(profile);
    await command.reply({ embeds: [embed] });
  }
}

export class RandomProfileAction extends CreateCommandEventAction {
  private readonly endpoint: ProfileEndpoint;

  constructor(endpoint: ProfileEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(command: CommandInteraction) {
    const owner = command.options.getUser("owner", false);
    const author = command.options.getUser("author", false);
    const content = command.options.getString("content", false);

    const profiles = await this.endpoint.random(command.user.id, {
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
  private readonly endpoint: ProfileEndpoint;

  constructor(endpoint: ProfileEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(command: CommandInteraction) {
    const defaultPage = 1;
    const order = command.options.getString("order", false);
    const owner = command.options.getUser("owner", false);
    const author = command.options.getUser("author", false);
    const page = command.options.getInteger("page", false);
    const content = command.options.getString("content", false);

    if (order && order !== "latest" && order !== "oldest") {
      throw new ParameterFormatInvalidError("order", "latest または oldest");
    }

    const profiles = await this.endpoint.search(command.user.id, {
      order: (order as "latest" | "oldest" | null) ?? "latest",
      ownerDiscordId: owner?.id,
      authorDiscordId: author?.id,
      page: page ?? defaultPage,
      content: content ?? undefined
    });

    const listEmbed = new ProfileListEmbed(profiles);
    await command.reply({ embeds: [listEmbed] });
  }
}

export class ShowProfileAction extends CreateCommandEventAction {
  private readonly endpoint: ProfileEndpoint;

  constructor(endpoint: ProfileEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    const profile = await this.endpoint.find(command.user.id, {
      index: number
    });

    const listEmbed = new ProfileListEmbed([profile]);
    await command.reply({ embeds: [listEmbed] });
  }
}
