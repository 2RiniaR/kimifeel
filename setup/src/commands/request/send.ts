import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { contentOption, targetOption } from "src/commands/request/options";

export const sendCommand: CommandOption = {
  type: SubCommand,
  name: "send",
  description: "リクエストを送信する",
  options: [
    { ...targetOption, required: true },
    { ...contentOption, required: true }
  ]
};
