import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { numberOption, targetOption } from "src/commands/request/options";

export const cancelCommand: CommandOption = {
  type: SubCommand,
  name: "cancel",
  description: "リクエストを取り消す",
  options: [
    { ...targetOption, required: true },
    { ...numberOption, required: true }
  ]
};
