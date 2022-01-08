import { MessageReaction, PartialUser, User } from "discord.js";
import { ClientManager } from "../client";

export type AddEventOptions = {
  emojis: string[];
  allowBot: boolean;
  myMessageOnly: boolean;
};

export type AddEventHandler = (reaction: MessageReaction, user: User) => PromiseLike<void>;

type AddEventRegistration = {
  handler: AddEventHandler;
  options: AddEventOptions;
};

export class ReactionEventRunner {
  private readonly client: ClientManager;
  private readonly registrations = {
    onAdd: [] as AddEventRegistration[]
  };

  constructor(client: ClientManager) {
    this.client = client;
    client.onReactionAdd((reaction, user) => this.onReactionAdded(reaction, user));
  }

  public registerAddEvent(handler: AddEventHandler, options: AddEventOptions) {
    this.registrations.onAdd.push({ handler, options });
  }

  private async onReactionAdded(reaction: MessageReaction, user: User) {
    let registrations = this.registrations.onAdd;

    registrations = registrations.filter(
      (registrations) =>
        this.checkMessageAuthor(reaction, registrations.options) &&
        this.checkReactionEmoji(reaction, registrations.options) &&
        this.checkBot(user, registrations.options)
    );

    await registrations.mapAsync(async (registrations) => await registrations.handler(reaction, user));
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
