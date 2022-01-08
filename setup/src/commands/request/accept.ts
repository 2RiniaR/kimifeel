import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { numberOption } from "src/commands/request/options";

export const acceptCommand: CommandOption = {
  type: SubCommand,
  name: "accept",
  description: "リクエストを承認する",
  options: [{ ...numberOption, required: true }]
};
