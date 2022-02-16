import { FragmentLimitError, SyntaxError } from "./errors";

export type CommandFragments = {
  readonly prefix: string;
  readonly arguments: readonly string[];
  readonly options: { [name: string]: string };
};

enum ParseState {
  InterpretNextFragment,
  ExpectOptionName,
  ExpectValue,
  ExpectSkinValueContent,
  ExpectInlineValueContent
}

type Bracket = {
  readonly start: string;
  readonly end: string;
};

export class CommandParser {
  private static iterationLimit = 100 as const;
  private static inlineValueBrackets: Bracket[] = [
    { start: '"', end: '"' },
    { start: "'", end: "'" }
  ];

  private static optionNamePrefix = "--";
  private static separatorRegex = /\s+/;

  private state = ParseState.InterpretNextFragment;
  private queue: string;
  private readingOption: string | undefined = undefined;
  private readingBracket: Bracket | undefined = undefined;

  private prefix: string | undefined;
  private arguments: string[] = [];
  private options: { [name: string]: string } = {};

  public constructor(public readonly original: string, public readonly expectPrefixes: readonly string[]) {
    this.queue = original;
  }

  public parse(): CommandFragments | undefined {
    this.readPrefix();
    if (this.prefix === undefined) return undefined;

    let iteration = 0;
    while (this.queue.length > 0) {
      if (++iteration >= CommandParser.iterationLimit) throw new FragmentLimitError();
      this.readNext();
    }

    return {
      prefix: this.prefix,
      arguments: this.arguments,
      options: this.options
    };
  }

  private readNext() {
    switch (this.state) {
      case ParseState.InterpretNextFragment:
        this.interpretNextFragment();
        break;
      case ParseState.ExpectOptionName:
        this.readOptionName();
        break;
      case ParseState.ExpectValue:
        this.readValue();
        break;
      case ParseState.ExpectSkinValueContent:
        this.readSkinValueContent();
        break;
      case ParseState.ExpectInlineValueContent:
        this.readInlineValueContent();
        break;
    }
  }

  private readPrefix() {
    for (const prefix of this.expectPrefixes) {
      if (!this.queue.startsWith(prefix)) continue;
      this.prefix = prefix;
      this.queue = this.queue.substring(prefix.length).trimStart();
      return;
    }
  }

  private interpretNextFragment() {
    if (this.queue.startsWith(CommandParser.optionNamePrefix)) {
      this.queue = this.queue.substring(CommandParser.optionNamePrefix.length);
      this.state = ParseState.ExpectOptionName;
    } else {
      this.state = ParseState.ExpectValue;
    }
  }

  private readOptionName() {
    const name = this.queue.split(CommandParser.separatorRegex, 1)[0];
    this.readingOption = name;
    this.queue = this.queue.substring(name.length).trimStart();
    if (this.queue.length === 0) throw new SyntaxError();
    this.state = ParseState.ExpectValue;
  }

  private readValue() {
    for (const bracket of CommandParser.inlineValueBrackets) {
      if (!this.queue.startsWith(bracket.start)) continue;
      this.readingBracket = bracket;
      this.queue = this.queue.substring(bracket.start.length);
      this.state = ParseState.ExpectInlineValueContent;
      return;
    }

    this.state = ParseState.ExpectSkinValueContent;
  }

  private applyValue(value: string) {
    if (this.readingOption === undefined) {
      this.arguments.push(value);
    } else {
      this.options[this.readingOption] = value;
      this.readingOption = undefined;
    }
  }

  private readSkinValueContent() {
    if (this.queue.startsWith(CommandParser.optionNamePrefix)) throw new SyntaxError();

    const value = this.queue.split(CommandParser.separatorRegex, 1)[0];
    this.applyValue(value);

    this.queue = this.queue.substring(value.length).trimStart();
    this.state = ParseState.InterpretNextFragment;
  }

  private readInlineValueContent() {
    if (!this.readingBracket) throw Error();

    const end = this.queue.indexOf(this.readingBracket.end, 1);
    if (end === -1) throw new SyntaxError();

    const value = this.queue.substring(0, end);
    this.applyValue(value);

    this.queue = this.queue.substring(value.length + this.readingBracket.end.length).trimStart();
    this.state = ParseState.InterpretNextFragment;
    this.readingBracket = undefined;
  }
}
