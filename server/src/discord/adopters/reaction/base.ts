import { Message, MessageReaction, User } from "discord.js";
import { getErrorEmbed } from "../error-embed";
import { AddEventListener } from "discord/events/reaction";
import { fetchMessage } from "../../fetch";

export abstract class AddEventAction implements AddEventListener {
  abstract run(reaction: MessageReaction, user: User, message: Message): PromiseLike<void>;

  async onReactionAdded(reaction: MessageReaction, user: User) {
    const message = await fetchMessage(reaction.message);

    try {
      await this.run(reaction, user, message);
    } catch (error) {
      console.error(error);
      const embed = getErrorEmbed(error);
      await message.reply({ embeds: [embed] });
    }
  }
}
