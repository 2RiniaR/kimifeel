export type Command = {
  name: string;
  type?: number;
  options: CommandOption[];
  description?: string;
};

export type CommandOption = {
  type: number;
  name: string;
  description: string;
  required?: boolean;
  choices?: CommandOptionChoice[];
  options?: CommandOption[];
  channel_types?: number[];
  min_value?: number;
  max_value?: number;
  autocomplete?: boolean;
};

export type CommandOptionChoice = {
  name: string;
  value: number | string;
};
