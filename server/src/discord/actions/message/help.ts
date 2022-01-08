import { CreateCommandEventAction } from "./base";
import { Message } from "discord.js";
import { HelpEmbed } from "../../views/help";

export class HelpAction extends CreateCommandEventAction {
  async run(message: Message) {
    const embed = new HelpEmbed();
    await message.reply({ embeds: [embed] });
  }
}
