import { GuildMember, Message, MessageReaction, PartialMessageReaction } from "discord.js";
import { clientManager, targetGuildManager } from "../index";
import { Event } from "../event";

export type ReactionAddEventContext = {
  reaction: MessageReaction;
  member: GuildMember;
  message: Message;
};

export type ReactionAddEventOptions = {
  allowBot: boolean;
  myMessageOnly: boolean;
};

export class ReactionAddEvent extends Event<ReactionAddEventContext> {
  emojis: string[];
  options: ReactionAddEventOptions;

  constructor(emojis: string[] = [], options?: Partial<ReactionAddEventOptions>) {
    super();
    this.emojis = emojis;
    this.options = {
      allowBot: options?.allowBot ?? false,
      myMessageOnly: options?.myMessageOnly ?? false
    };
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
      const messageCheckPassed =
        !this.options.myMessageOnly ||
        (rawReaction.message.author &&
          clientManager.client.user &&
          rawReaction.message.author.id === clientManager.client.user.id);
      if (
        !this.emojis.includes(rawReaction.emoji.toString()) ||
        (!this.options.allowBot && user.bot) ||
        !messageCheckPassed
      )
        return;

      const member = await targetGuildManager.getMember(user.id);
      if (!member) return;
      const reaction = await ReactionAddEvent.fetchReaction(rawReaction);
      const message = await ReactionAddEvent.fetchMessage(reaction);
      await listener({ reaction, member, message });
    });
  }
}
