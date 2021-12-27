import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { numberOption } from "src/commands/request/options";

export const showCommand: CommandOption = {
  type: SubCommand,
  name: "show",
  description: "リクエストを指定して表示する",
  options: [{ ...numberOption, required: true }]
};
