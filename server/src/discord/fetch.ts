import { Message, MessageReaction, PartialMessage, PartialMessageReaction, PartialUser, User } from "discord.js";

export async function fetchMessage(message: Message | PartialMessage): Promise<Message> {
  if (message instanceof Message) return message;
  return await message.fetch();
}

export async function fetchReaction(reaction: MessageReaction | PartialMessageReaction): Promise<MessageReaction> {
  if (reaction instanceof MessageReaction) return reaction;
  return await reaction.fetch();
}

export async function fetchUser(user: User | PartialUser): Promise<User> {
  if (user instanceof User) return user;
  return await user.fetch();
}
