import { CreateCommandEventListener } from "discord/events/message";
import { Message } from "discord.js";
import { getErrorEmbed } from "../error-embed";
import { CommandFragments } from "command-parser";

export abstract class CreateCommandEventAction implements CreateCommandEventListener {
  abstract run(message: Message, command: CommandFragments): PromiseLike<void>;

  async onCommandCreated(message: Message, command: CommandFragments) {
    try {
      await this.run(message, command);
    } catch (error) {
      console.error(error);
      const embed = getErrorEmbed(error);
      await message.reply({ embeds: [embed] });
    }
  }
}
