import { SubCommand, User, Boolean } from "./option-types";
import { Command, CommandOption } from "./format";

const userOption: CommandOption = {
  type: User,
  name: "target",
  description: "対象のユーザー"
};

const enableMentionOption: CommandOption = {
  type: Boolean,
  name: "enable-mention",
  description: "メンションを有効化するか"
};

const configCommand: CommandOption = {
  type: SubCommand,
  name: "config",
  description: "ユーザー設定を更新する",
  options: [enableMentionOption]
};

const registerCommand: CommandOption = {
  type: SubCommand,
  name: "register",
  description: "ユーザー登録する"
};

const statsCommand: CommandOption = {
  type: SubCommand,
  name: "stats",
  description: "ユーザーの統計情報を見る",
  options: [{ ...userOption, required: true }]
};

export const userCommand: Command = {
  name: "user",
  description: "ユーザーに関するコマンド",
  options: [registerCommand, configCommand, statsCommand]
};
