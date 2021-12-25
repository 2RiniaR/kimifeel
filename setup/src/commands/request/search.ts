import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { orderOption, pageOption } from "src/commands/options";
import { applicantOption, contentOption, genreOption, targetOption } from "src/commands/request/options";

export const searchCommand: CommandOption = {
  type: SubCommand,
  name: "search",
  description: "リクエストを検索して表示する",
  options: [genreOption, pageOption, orderOption, contentOption, applicantOption, targetOption]
};
