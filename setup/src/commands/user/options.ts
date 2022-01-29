import { CommandOption } from "src/commands/format";
import { Boolean, User } from "src/option-types";

export const userOption: CommandOption = {
  type: User,
  name: "target",
  description: "対象のユーザー"
};

export const enableMentionOption: CommandOption = {
  type: Boolean,
  name: "enable-mention",
  description: "メンションを有効化するか"
};
