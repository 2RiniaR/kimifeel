import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { userOption } from "./options";

export const statsCommand: CommandOption = {
  type: SubCommand,
  name: "stats",
  description: "ユーザーの統計情報を見る",
  options: [{ ...userOption, required: true }]
};
