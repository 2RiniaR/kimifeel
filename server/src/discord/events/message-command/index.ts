import { GuildMember, Message } from "discord.js";
import { Event } from "discord/events";
import { clientManager, targetGuildManager } from "../../index";
import { parseCommand, CommandFormatOn, CommandResultOf } from "command-parser";
import { parameterTypes } from "./types";

export type MessageCommandFormat = CommandFormatOn<typeof parameterTypes>;
export type MessageCommandResultOf<TFormat extends MessageCommandFormat> = CommandResultOf<
  typeof parameterTypes,
  TFormat
>;

export type MessageCommandEventContext<TFormat extends MessageCommandFormat> = {
  readonly message: Message;
  readonly member: GuildMember;
  readonly command: CommandResultOf<typeof parameterTypes, TFormat>;
};

export type MessageCommandEventOptions<TFormat extends MessageCommandFormat> = {
  readonly format: TFormat;
  readonly allowBot: boolean;
};

function checkBot(message: Message, options: MessageCommandEventOptions<MessageCommandFormat>) {
  return options.allowBot || !message.author.bot;
}

export class MessageCommandEvent<TFormat extends MessageCommandFormat> extends Event<
  MessageCommandEventContext<TFormat>,
  MessageCommandEventOptions<TFormat>
> {
  public activate() {
    clientManager.client.on("messageCreate", async (message) => {
      const sessions = this.listeners
        .map((listener) => {
          if (!checkBot(message, listener.options)) return;
          const command = parseCommand(message.content, listener.options.format, parameterTypes);
          if (!command) return;
          return { listener, command };
        })
        .removeNone();
      if (sessions.length === 0) return;

      const member = await targetGuildManager.getMember(message.author.id);
      if (!member) return;

      await sessions.forEachAsync(async ({ listener, command }) => {
        const context: MessageCommandEventContext<TFormat> = { member, message, command };
        await listener.onEvent(context);
      });
    });
  }
}
