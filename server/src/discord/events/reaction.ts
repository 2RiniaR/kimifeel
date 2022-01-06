import { GuildMember, Message, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { clientManager, targetGuildManager } from "../index";

export type AddedEventContext = {
  reaction: MessageReaction;
  member: GuildMember;
  message: Message;
};

export type AddedEventOptions = {
  emojis: string[];
  allowBot: boolean;
  myMessageOnly: boolean;
};

export interface AddedEventListener {
  onAddedEvent(context: AddedEventContext): PromiseLike<void>;
}

type AddedEventRegistration = {
  listener: AddedEventListener;
  options: AddedEventOptions;
};

export interface ReactionEventProvider {
  onReactionAdded(handler: (reaction: MessageReaction, user: User) => PromiseLike<void>): void;
}

export class ReactionEventRunner {
  private readonly registrations = {
    onAdded: [] as AddedEventRegistration[]
  };

  constructor(provider: ReactionEventProvider) {
    provider.onReactionAdded((reaction, user) => this.onReactionAdded(reaction, user));
  }

  public registerAddEvent(listener: AddedEventListener, options: AddedEventOptions) {
    this.registrations.onAdded.push({ listener, options });
  }

  private async onReactionAdded(reaction: MessageReaction, user: User) {
    const registrationss = this.registrations.onAdded.filter(
      (registrations) =>
        this.checkMessageAuthor(reaction, registrations.options) &&
        this.checkReactionEmoji(reaction, registrations.options) &&
        this.checkBot(user, registrations.options)
    );

    const member = await targetGuildManager.getMember(user.id);
    if (!member) return;
    const message = await this.fetchMessage(reaction);

    const context = { reaction, member, message };
    await registrationss.mapAsync(async (registrations) => await registrations.listener.onAddedEvent(context));
  }

  checkMessageAuthor(reaction: MessageReaction | PartialMessageReaction, options: AddedEventOptions) {
    return (
      !options.myMessageOnly ||
      (reaction.message.author &&
        clientManager.client.user &&
        reaction.message.author.id === clientManager.client.user.id)
    );
  }

  checkReactionEmoji(reaction: MessageReaction | PartialMessageReaction, options: AddedEventOptions) {
    return options.emojis.includes(reaction.emoji.toString());
  }

  checkBot(user: User | PartialUser, options: AddedEventOptions) {
    return options.allowBot || !user.bot;
  }

  async fetchReaction(reaction: MessageReaction | PartialMessageReaction): Promise<MessageReaction> {
    if (reaction instanceof MessageReaction) return reaction;
    return await reaction.fetch();
  }

  async fetchMessage(reaction: MessageReaction): Promise<Message> {
    const message = reaction.message;
    if (message instanceof Message) return message;
    return await message.fetch();
  }
}
