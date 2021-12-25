import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { authorOption, contentOption, ownerOption } from "src/commands/profile/options";

export const randomCommand: CommandOption = {
  type: SubCommand,
  name: "random",
  description: "条件付きでランダムなプロフィールを表示する",
  options: [ownerOption, authorOption, contentOption]
};
