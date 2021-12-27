import { SubCommand } from "src/option-types";
import { CommandOption } from "src/commands/format";
import { numberOption } from "src/commands/profile/options";

export const showCommand: CommandOption = {
  type: SubCommand,
  name: "show",
  description: "プロフィールを指定して表示する",
  options: [{ ...numberOption, required: true }]
};
