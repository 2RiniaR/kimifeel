import { Message } from "discord.js";
import { CommandFragments, interpretCommand } from "command-parser";
import { ProfileEndpoint } from "endpoints/profile";
import { parameterTypes } from "./command";
import { ErrorEmbed, ProfileDeletedEmbed, ProfileListEmbed } from "../../views";

export class ProfileAction {
  private readonly endpoint: ProfileEndpoint;

  constructor(endpoint: ProfileEndpoint) {
    this.endpoint = endpoint;
  }

  async delete(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "プロフィールの番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    let profile;
    try {
      profile = await this.endpoint.delete(message.author.id, { index: interpret.arguments[0] });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await message.reply({ embeds: [embed] });
      return;
    }

    const embed = new ProfileDeletedEmbed(profile);
    await message.reply({ embeds: [embed] });
  }

  async random(message: Message, command: CommandFragments) {
    const format = {
      arguments: [],
      options: {
        owner: { name: "対象ユーザーのID", type: "userId" },
        author: { name: "プロフィールを書いたユーザーのID", type: "userId" },
        content: { name: "含まれている文字列", type: "string" }
      }
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    let profiles;
    try {
      profiles = await this.endpoint.random(message.author.id, {
        ownerDiscordId: interpret.options.owner,
        authorDiscordId: interpret.options.author,
        content: interpret.options.content
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await message.reply({ embeds: [embed] });
      return;
    }

    const listEmbed = new ProfileListEmbed(profiles);
    await message.reply({ embeds: [listEmbed] });
  }

  async search(message: Message, command: CommandFragments) {
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

    const defaultPage = 1;
    const orderTypes = ["latest", "oldest"] as const;
    const order = interpret.options.order;
    if (order && !(order in orderTypes)) {
      throw Error();
    }

    let profiles;
    try {
      profiles = await this.endpoint.search(message.author.id, {
        order: (order as "oldest" | "latest") ?? "latest",
        ownerDiscordId: interpret.options.owner,
        authorDiscordId: interpret.options.author,
        content: interpret.options.content,
        page: interpret.options.page ?? defaultPage
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await message.reply({ embeds: [embed] });
      return;
    }

    const listEmbed = new ProfileListEmbed(profiles);
    await message.reply({ embeds: [listEmbed] });
  }

  async show(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "プロフィールの番号", type: "integer" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    let profile;
    try {
      profile = await this.endpoint.find(message.author.id, {
        index: interpret.arguments[0]
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await message.reply({ embeds: [embed] });
      return;
    }

    const listEmbed = new ProfileListEmbed([profile]);
    await message.reply({ embeds: [listEmbed] });
  }
}
