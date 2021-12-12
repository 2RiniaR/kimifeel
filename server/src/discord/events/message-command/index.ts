import { GuildMember, Message } from "discord.js";
import { Event } from "../event";
import { clientManager, targetGuildManager } from "../../index";
import { parseCommand } from "./command-parser";
import { NamedCommandFormat, NamedCommandParseResult } from "./named-command-format";

export type MessageCommandEventContext<TFormat extends NamedCommandFormat = NamedCommandFormat> = {
  message: Message;
  member: GuildMember;
  command: NamedCommandParseResult<TFormat>;
};

export type MessageCommandEventOptions<TFormat extends NamedCommandFormat = NamedCommandFormat> = {
  format: TFormat;
  allowBot: boolean;
};

function checkBot(message: Message, options: MessageCommandEventOptions) {
  return options.allowBot || !message.author.bot;
}

export class MessageCommandEvent<TFormat extends NamedCommandFormat> extends Event<
  MessageCommandEventContext<TFormat>,
  MessageCommandEventOptions<TFormat>
> {
  public activate() {
    clientManager.client.on("messageCreate", async (message) => {
      const sessions = this.listeners
        .map((listener) => {
          if (!checkBot(message, listener.options)) return;
          const command = parseCommand(message.content, listener.options.format);
          if (!command) return;
          return { listener, command };
        })
        .removeNone();
      if (sessions.length === 0) return;

      const member = await targetGuildManager.getMember(message.author.id);
      if (!member) return;

      await sessions.forEachAsync(async ({ listener, command }) => {
        const context = { member, message, command };
        await listener.onEvent(context);
      });
    });
  }
}
