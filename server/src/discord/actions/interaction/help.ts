import { CreateCommandEventAction } from "./base";
import { CommandInteraction } from "discord.js";
import { HelpEmbed } from "../../views/help";

export class HelpAction extends CreateCommandEventAction {
  async run(command: CommandInteraction) {
    const embed = new HelpEmbed();
    await command.reply({ embeds: [embed] });
  }
}
