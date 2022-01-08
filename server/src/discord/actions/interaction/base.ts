import { CreateCommandEventListener } from "discord/events/interaction";
import { CommandInteraction } from "discord.js";
import { getErrorEmbed } from "../error-embed";

export abstract class CreateCommandEventAction implements CreateCommandEventListener {
  abstract run(command: CommandInteraction): PromiseLike<void>;

  async onCommandCreated(command: CommandInteraction) {
    try {
      await this.run(command);
    } catch (error) {
      console.error(error);
      const embed = getErrorEmbed(error);
      await command.reply({ embeds: [embed], ephemeral: true });
    }
  }
}
