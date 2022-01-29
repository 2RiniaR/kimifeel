import { CommandOption } from "src/commands/format";
import { SubCommand } from "src/option-types";
import { enableMentionOption } from "src/commands/user/options";

export const configCommand: CommandOption = {
  type: SubCommand,
  name: "config",
  description: "ユーザー設定を更新する",
  options: [enableMentionOption]
};
