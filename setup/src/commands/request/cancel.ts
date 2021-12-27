import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { numberOption } from "src/commands/request/options";

export const cancelCommand: CommandOption = {
  type: SubCommand,
  name: "cancel",
  description: "リクエストを取り消す",
  options: [{ ...numberOption, required: true }]
};
