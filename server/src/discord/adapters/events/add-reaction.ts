import { MessageReaction as RawMessageReaction, PartialUser, User } from "discord.js";
import { AddReactionTrigger, AddReactionTriggerHandler, AddReactionTriggerOptions } from "../../routers";
import { ReactionImpl, MessageImpl, ClientImpl } from "../structures";
import { fetchMessage } from "../fetch";

type Registration = {
  handler: AddReactionTriggerHandler;
  options: AddReactionTriggerOptions;
};

export class AddReactionEventProvider implements AddReactionTrigger {
  private readonly client: ClientImpl;
  private readonly registrations: Registration[] = [];

  constructor(client: ClientImpl) {
    this.client = client;
    client.onReactionAdd(async (reaction, user) => {
      try {
        await this.onReactionAdded(reaction, user);
      } catch (error) {
        console.error(error);
      }
    });
  }

  public onTrigger(handler: AddReactionTriggerHandler, options: AddReactionTriggerOptions) {
    this.registrations.push({ handler, options });
  }

  private async onReactionAdded(rawReaction: RawMessageReaction, user: User) {
    const registrations = this.registrations.filter(
      (registrations) =>
        this.checkMessageAuthor(rawReaction, registrations.options) &&
        this.checkReactionEmoji(rawReaction, registrations.options) &&
        this.checkBot(user, registrations.options)
    );

    const message = new MessageImpl(await fetchMessage(rawReaction.message));
    const reaction = new ReactionImpl(message);
    await Promise.all(registrations.map(async (registrations) => await registrations.handler(reaction)));
  }

  private checkMessageAuthor(reaction: RawMessageReaction, options: AddReactionTriggerOptions): boolean {
    return (
      !options.myMessageOnly ||
      (!!reaction.message.author && !!this.client.user && reaction.message.author.id === this.client.user.id)
    );
  }

  private checkReactionEmoji(reaction: RawMessageReaction, options: AddReactionTriggerOptions): boolean {
    return options.emojis.includes(reaction.emoji.toString());
  }

  private checkBot(user: User | PartialUser, options: AddReactionTriggerOptions): boolean {
    return options.allowBot || !user.bot;
  }
}
