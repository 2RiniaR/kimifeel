import { MessageReaction as RawMessageReaction, PartialUser, User } from "discord.js";
import { AddReactionTrigger, AddReactionTriggerHandler, AddReactionTriggerOptions } from "../../routers";
import { MessageImpl, ClientImpl } from "../structures";
import { fetchMessage } from "../fetch";
import { Reaction } from "../../structures";

type TriggerRegistration = {
  handler: AddReactionTriggerHandler;
  options: AddReactionTriggerOptions;
};

export class AddReactionEventProvider implements AddReactionTrigger {
  private readonly client: ClientImpl;
  private readonly triggerRegistrations: TriggerRegistration[] = [];

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
    this.triggerRegistrations.push({ handler, options });
  }

  private async onReactionAdded(rawReaction: RawMessageReaction, user: User) {
    const registrations = this.triggerRegistrations.filter(
      (registrations) =>
        this.checkMessageAuthor(rawReaction, registrations.options) &&
        this.checkReactionEmoji(rawReaction, registrations.options) &&
        this.checkBot(user, registrations.options.allowBot)
    );

    const message = new MessageImpl(await fetchMessage(rawReaction.message));
    const reaction: Reaction = { message, reactedUser: { id: user.id } };
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

  private checkBot(user: User | PartialUser, allowBot: boolean): boolean {
    return !user.bot || allowBot;
  }
}
