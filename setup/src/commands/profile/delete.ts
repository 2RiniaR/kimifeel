import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { numberOption } from "src/commands/profile/options";

export const deleteCommand: CommandOption = {
  type: SubCommand,
  name: "delete",
  description: "自分のプロフィールを削除する",
  options: [{ ...numberOption, required: true }]
};
