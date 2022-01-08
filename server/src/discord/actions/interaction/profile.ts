import { ErrorEmbed, ProfileDeletedEmbed, ProfileListEmbed } from "discord/views";
import { ProfileEndpoint } from "endpoints/profile";
import { NoBotActionError } from "../errors";
import { CommandInteraction } from "discord.js";

export class ProfileAction {
  private readonly endpoint: ProfileEndpoint;

  constructor(endpoint: ProfileEndpoint) {
    this.endpoint = endpoint;
  }

  async delete(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    let profile;
    try {
      profile = await this.endpoint.delete(command.user.id, {
        index: number
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await command.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const embed = new ProfileDeletedEmbed(profile);
    await command.reply({ embeds: [embed] });
  }

  async random(command: CommandInteraction) {
    const owner = command.options.getUser("owner", false);
    const author = command.options.getUser("author", false);
    const content = command.options.getString("content", false);

    if ((owner && owner.bot) || (author && author.bot)) {
      throw new NoBotActionError();
    }

    let profiles;
    try {
      profiles = await this.endpoint.random(command.user.id, {
        ownerDiscordId: owner?.id,
        authorDiscordId: author?.id,
        content: content ?? undefined
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await command.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const listEmbed = new ProfileListEmbed(profiles);
    await command.reply({ embeds: [listEmbed] });
  }

  async search(command: CommandInteraction) {
    const order = command.options.getString("order", false);
    const owner = command.options.getUser("owner", false);
    const author = command.options.getUser("author", false);
    const page = command.options.getInteger("page", false);
    const content = command.options.getString("content", false);

    if (order && order !== "latest" && order !== "oldest") {
      throw new Error();
    }

    const defaultPage = 1;
    if ((owner && owner.bot) || (author && author.bot)) {
      throw new NoBotActionError();
    }

    let profiles;
    try {
      profiles = await this.endpoint.search(command.user.id, {
        order: (order as "latest" | "oldest" | null) ?? "latest",
        ownerDiscordId: owner?.id,
        authorDiscordId: author?.id,
        page: page ?? defaultPage,
        content: content ?? undefined
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await command.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const listEmbed = new ProfileListEmbed(profiles);
    await command.reply({ embeds: [listEmbed] });
  }

  async show(command: CommandInteraction) {
    const number = command.options.getInteger("number", true);

    let profile;
    try {
      profile = await this.endpoint.find(command.user.id, {
        index: number
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await command.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const listEmbed = new ProfileListEmbed([profile]);
    await command.reply({ embeds: [listEmbed] });
  }
}
