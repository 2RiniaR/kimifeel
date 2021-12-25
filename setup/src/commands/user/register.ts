import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";

export const registerCommand: CommandOption = {
  type: SubCommand,
  name: "register",
  description: "ユーザー登録する"
};
