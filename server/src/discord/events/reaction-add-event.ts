import { GuildMember, Message, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { clientManager, targetGuildManager } from "../index";
import { Event } from "../event";

export type ReactionAddEventContext = {
  reaction: MessageReaction;
  member: GuildMember;
  message: Message;
};

export type ReactionAddEventOptions = {
  emojis: string[];
  allowBot: boolean;
  myMessageOnly: boolean;
};

export class ReactionAddEvent extends Event<ReactionAddEventContext, ReactionAddEventOptions> {
  public activate() {
    clientManager.client.on("messageReactionAdd", async (rawReaction, user) => {
      const listeners = this.listeners.filter(
        (listener) =>
          ReactionAddEvent.checkMessageAuthor(rawReaction, listener.options) &&
          ReactionAddEvent.checkReactionEmoji(rawReaction, listener.options) &&
          ReactionAddEvent.checkBot(user, listener.options)
      );

      const member = await targetGuildManager.getMember(user.id);
      if (!member) return;
      const reaction = await ReactionAddEvent.fetchReaction(rawReaction);
      const message = await ReactionAddEvent.fetchMessage(reaction);

      const context: ReactionAddEventContext = { reaction, member, message };
      await listeners.mapAsync((listener) => listener.onEvent(context));
    });
  }

  private static checkMessageAuthor(
    reaction: MessageReaction | PartialMessageReaction,
    options: ReactionAddEventOptions
  ) {
    return (
      !options.myMessageOnly ||
      (reaction.message.author &&
        clientManager.client.user &&
        reaction.message.author.id === clientManager.client.user.id)
    );
  }

  private static checkReactionEmoji(
    reaction: MessageReaction | PartialMessageReaction,
    options: ReactionAddEventOptions
  ) {
    return options.emojis.includes(reaction.emoji.toString());
  }

  private static checkBot(user: User | PartialUser, options: ReactionAddEventOptions) {
    return options.allowBot || !user.bot;
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
}
