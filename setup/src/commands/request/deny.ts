import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { numberOption } from "src/commands/request/options";

export const denyCommand: CommandOption = {
  type: SubCommand,
  name: "deny",
  description: "リクエストを拒否する",
  options: [{ ...numberOption, required: true }]
};
