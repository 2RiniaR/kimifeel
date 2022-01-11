import { MessageReaction, PartialUser, User } from "discord.js";
import { ClientManager } from "../client";

export type AddEventOptions = {
  emojis: string[];
  allowBot: boolean;
  myMessageOnly: boolean;
};

export interface AddEventListener {
  onReactionAdded(reaction: MessageReaction, user: User): PromiseLike<void>;
}

type AddEventRegistration = {
  listener: AddEventListener;
  options: AddEventOptions;
};

export class ReactionEventRunner {
  private readonly client: ClientManager;
  private readonly registrations = {
    onAdd: [] as AddEventRegistration[]
  };

  constructor(client: ClientManager) {
    this.client = client;
    client.onReactionAdd(async (reaction, user) => {
      try {
        await this.onReactionAdded(reaction, user);
      } catch (error) {
        console.error(error);
      }
    });
  }

  public registerAddEvent(listener: AddEventListener, options: AddEventOptions) {
    this.registrations.onAdd.push({ listener, options });
  }

  private async onReactionAdded(reaction: MessageReaction, user: User) {
    let registrations = this.registrations.onAdd;

    registrations = registrations.filter(
      (registrations) =>
        this.checkMessageAuthor(reaction, registrations.options) &&
        this.checkReactionEmoji(reaction, registrations.options) &&
        this.checkBot(user, registrations.options)
    );

    await registrations.mapAsync(async (registrations) => await registrations.listener.onReactionAdded(reaction, user));
  }

  checkMessageAuthor(reaction: MessageReaction, options: AddEventOptions) {
    return (
      !options.myMessageOnly ||
      (reaction.message.author && this.client.user && reaction.message.author.id === this.client.user.id)
    );
  }

  checkReactionEmoji(reaction: MessageReaction, options: AddEventOptions) {
    return options.emojis.includes(reaction.emoji.toString());
  }

  checkBot(user: User | PartialUser, options: AddEventOptions) {
    return options.allowBot || !user.bot;
  }
}
