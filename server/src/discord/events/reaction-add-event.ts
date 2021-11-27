import { Event } from "~/discord/event";
import { GuildMember, Message, MessageReaction, PartialMessageReaction } from "discord.js";
import { clientManager, targetGuildManager } from "~/discord";

export type ReactionAddEventContext = {
  reaction: MessageReaction;
  member: GuildMember;
  message: Message;
};

export class ReactionAddEvent extends Event<ReactionAddEventContext> {
  emojis: string[];
  allowBot: boolean;

  constructor(emojis: string[] = [], allowBot = false) {
    super();
    this.emojis = emojis;
    this.allowBot = allowBot;
  }

  private static async fetchReaction(reaction: MessageReaction | PartialMessageReaction): Promise<MessageReaction> {
    if (reaction instanceof MessageReaction) return reaction;
    return await reaction.fetch();
  }

  private static async fetchMessage(reaction: MessageReaction): Promise<Message> {
    const message = reaction.message;
    if (message instanceof Message) return message;
    return await message.fetch();
  }

  override register(listener: (props: ReactionAddEventContext) => Promise<void>): void {
    clientManager.client.on("messageReactionAdd", async (rawReaction, user) => {
      if (!this.emojis.includes(rawReaction.emoji.toString()) || (!this.allowBot && user.bot)) return;
      const member = await targetGuildManager.getMember(user.id);
      if (!member) return;
      const reaction = await ReactionAddEvent.fetchReaction(rawReaction);
      const message = await ReactionAddEvent.fetchMessage(reaction);
      await listener({ reaction, member, message });
    });
  }
}
