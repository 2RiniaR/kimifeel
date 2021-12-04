import { GuildMember, Message } from "discord.js";
import { Event } from "../../event";
import { clientManager, targetGuildManager } from "../../index";
import { interpretCommand } from "./parser";

export type MessageCommandEventContext = {
  message: Message;
  member: GuildMember;
  prefix: string;
  arguments: string[];
  options: { [name: string]: string };
};

export type MessageCommandEventOptions = {
  prefixes: string[];
  allowBot: boolean;
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
          const interpretation = interpretCommand(message.content, listener.options.prefixes);
          if (!interpretation) return;
          return { listener, interpretation };
        })
        .removeNone();
      if (sessions.length === 0) return;

      const member = await targetGuildManager.getMember(message.author.id);
      if (!member) return;

      await sessions.forEachAsync(async ({ listener, interpretation }) => {
        const context = {
          member,
          message: message,
          prefix: interpretation.prefix,
          options: interpretation.options,
          arguments: interpretation.arguments
        };
        await listener.onEvent(context);
      });
    });
  }
}
