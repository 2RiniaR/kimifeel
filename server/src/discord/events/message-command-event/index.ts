import { GuildMember, Message } from "discord.js";
import { Event } from "../../event";
import { clientManager, targetGuildManager } from "../../index";

export type MessageCommandEventContext = {
  message: Message;
  member: GuildMember;
  prefix: string;
  arguments: string[];
  options: { [name: string]: string };
};

const messageCommandArgumentTypes = ["integer", "float", "string", "user-id"] as const;
export type MessageCommandArgumentTypes = typeof messageCommandArgumentTypes[number];

export type MessageCommandEventOptions = {
  prefixes: string[];
  arguments: MessageCommandArgumentTypes[];
  options: { [name: string]: MessageCommandArgumentTypes };
  allowBot: boolean;
};

type MessageCommandInterpretation = {
  prefix: string;
  arguments: string[];
  options: { [name: string]: string };
};

class InterpretIterationLimitError extends Error {}

function readPrefix(content: string, prefixes: string[]): { prefix: string; remain: string } | undefined {
  for (const prefix of prefixes) {
    if (!content.startsWith(prefix)) continue;
    return {
      prefix,
      remain: content.substring(prefix.length).trimStart()
    };
  }
}

const optionRegex = /^-+(\w+)\s+("(\S+)"|(\S+))(\s+\S+)$/;
function readOption(content: string): { key: string; value: string; remain: string } | undefined {
  const match = content.match(optionRegex);
  if (!match) return;
  const captures = match as string[];
  return {
    key: captures[0],
    value: captures[1],
    remain: captures[2]
  };
}

const argumentRegex = /^("(\S+)"|(\S+))(\s+\S+)$/;
function readArgument(content: string): { value: string; remain: string } | undefined {
  const match = content.match(argumentRegex);
  if (!match) return;
  const captures = match as string[];
  return {
    value: captures[0],
    remain: captures[1]
  };
}

function interpretCommand(content: string, prefixes: string[]): MessageCommandInterpretation | undefined {
  const iterationLimit = 100;
  const readPrefixResult = readPrefix(content, prefixes);
  if (!readPrefixResult) return;

  let { remain } = readPrefixResult;
  let iteration = 0;
  const elements: MessageCommandInterpretation = {
    prefix: readPrefixResult.prefix,
    arguments: [],
    options: {}
  };

  while (content.length > 0) {
    if (++iteration >= iterationLimit) {
      throw new InterpretIterationLimitError();
    }

    const readOptionResult = readOption(content);
    if (readOptionResult) {
      remain = readOptionResult.remain;
      elements.options[readOptionResult.key] = readOptionResult.value;
      continue;
    }

    const readArgumentResult = readArgument(content);
    if (readArgumentResult) {
      remain = readArgumentResult.remain;
      elements.arguments.push(readArgumentResult.value);
      continue;
    }

    break;
  }

  return elements;
}

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
