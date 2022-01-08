import { Command } from "src/commands/format";
import { registerCommand } from "src/commands/user/register";

export const userCommand: Command = {
  name: "user",
  description: "ユーザーに関するコマンド",
  options: [registerCommand]
};
