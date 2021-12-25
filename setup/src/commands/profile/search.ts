import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { orderOption, pageOption } from "src/commands/options";
import { authorOption, contentOption, ownerOption } from "src/commands/profile/options";

export const searchCommand: CommandOption = {
  type: SubCommand,
  name: "search",
  description: "プロフィールを検索して表示する",
  options: [orderOption, ownerOption, authorOption, contentOption, pageOption]
};
