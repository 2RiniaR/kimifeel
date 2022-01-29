import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { userOption } from "./options";

export const showCommand: CommandOption = {
  type: SubCommand,
  name: "show",
  description: "ユーザー情報を見る",
  options: [userOption]
};
