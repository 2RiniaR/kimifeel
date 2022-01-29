import { Message } from "discord.js";
import { UserEndpoint } from "endpoints/user";
import { UserConfiguredEmbed, UserRegisteredEmbed, UserStatisticsEmbed } from "discord/views";
import { CreateCommandEventAction } from "./base";
import { CommandFragments, interpretCommand } from "../../../command-parser";
import { parameterTypes } from "./command";
import { ArgumentFormatInvalidError } from "../errors";

export class RegisterUserAction extends CreateCommandEventAction {
  private readonly endpoint: UserEndpoint;

  constructor(endpoint: UserEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(message: Message) {
    const discordId = message.author.id;

    await this.endpoint.register(discordId);

    const embed = new UserRegisteredEmbed({ discordId });
    await message.reply({ embeds: [embed] });
  }
}

export class ShowUserAction extends CreateCommandEventAction {
  private readonly endpoint: UserEndpoint;

  constructor(endpoint: UserEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [{ name: "ユーザーのID", type: "userId" }],
      options: {}
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const user = await this.endpoint.show(message.id, {
      targetUserDiscordId: interpret.arguments[0]
    });

    const embed = new UserStatisticsEmbed(user);
    await message.reply({ embeds: [embed] });
  }
}

export class ConfigUserAction extends CreateCommandEventAction {
  private readonly endpoint: UserEndpoint;

  constructor(endpoint: UserEndpoint) {
    super();
    this.endpoint = endpoint;
  }

  async run(message: Message, command: CommandFragments) {
    const format = {
      arguments: [],
      options: {
        enableMention: {
          name: "メンションを有効にするか",
          type: "string"
        }
      }
    } as const;
    const interpret = interpretCommand(command, format, parameterTypes);

    const trueKeyWords = ["yes", "on", "true"];
    const falseKeyWords = ["no", "off", "false"];

    let enableMention: boolean | undefined = undefined;

    if (interpret.options.enableMention) {
      const keyWord = interpret.options.enableMention.toLowerCase();
      if (trueKeyWords.includes(keyWord)) enableMention = true;
      else if (falseKeyWords.includes(keyWord)) enableMention = false;
      else throw new ArgumentFormatInvalidError("enableMention", "yes/on/true/no/off/false");
    }

    const user = await this.endpoint.config(message.id, {
      enableMention
    });

    const embed = new UserConfiguredEmbed(user);
    await message.reply({ embeds: [embed] });
  }
}
