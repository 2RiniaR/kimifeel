export class InterpretIterationLimitError extends Error {}

type MessageCommandInterpretation = {
  prefix: string;
  arguments: string[];
  options: { [name: string]: string };
};

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

export function interpretCommand(content: string, prefixes: string[]): MessageCommandInterpretation | undefined {
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
