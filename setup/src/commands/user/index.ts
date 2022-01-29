import { Command } from "src/commands/format";
import { registerCommand } from "src/commands/user/register";
import { configCommand } from "src/commands/user/config";
import { statsCommand } from "src/commands/user/stats";

export const userCommand: Command = {
  name: "user",
  description: "ユーザーに関するコマンド",
  options: [registerCommand, configCommand, statsCommand]
};
