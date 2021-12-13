import { GuildMember, Message } from "discord.js";
import { Event } from "discord/events";
import { clientManager, targetGuildManager } from "discord";
import { CommandFragments, fragmentCommand } from "command-parser";

export type MessageCommandEventContext = {
  readonly message: Message;
  readonly member: GuildMember;
  readonly command: CommandFragments;
};

export type MessageCommandEventOptions = {
  readonly prefixes: readonly string[];
  readonly allowBot: boolean;
};

function checkBot(message: Message, options: MessageCommandEventOptions) {
  return options.allowBot || !message.author.bot;
}

export class MessageCommandEvent extends Event<MessageCommandEventContext, MessageCommandEventOptions> {
  public activate() {
    clientManager.client.on("messageCreate", async (message) => {
      const sessions = this.listeners
        .map((listener) => {
          if (!checkBot(message, listener.options)) return;
          const command = fragmentCommand(message.content, listener.options.prefixes);
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
