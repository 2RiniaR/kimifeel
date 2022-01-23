import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { contentCreateOption } from "src/commands/profile/options";

export const createCommand: CommandOption = {
  type: SubCommand,
  name: "create",
  description: "自分のプロフィールを作成する",
  options: [{ ...contentCreateOption, required: true }]
};
