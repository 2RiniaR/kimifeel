import { Integer, SubCommand, User, String } from "./option-types";
import { Command, CommandOption } from "./format";
import { orderOption, pageOption } from "./options";

const numberOption: CommandOption = {
  type: Integer,
  name: "number",
  description: "プロフィール番号",
  min_value: 1
};

const ownerOption: CommandOption = {
  type: User,
  name: "owner",
  description: "プロフィールを所持しているユーザー"
};

const authorOption: CommandOption = {
  type: User,
  name: "author",
  description: "プロフィールを書いたユーザー"
};

const contentOption: CommandOption = {
  type: String,
  name: "content",
  description: "含まれている文字列"
};

const contentCreateOption: CommandOption = {
  type: String,
  name: "content",
  description: "プロフィールの内容"
};

const createCommand: CommandOption = {
  type: SubCommand,
  name: "create",
  description: "自分のプロフィールを作成する",
  options: [{ ...contentCreateOption, required: true }]
};

const deleteCommand: CommandOption = {
  type: SubCommand,
  name: "delete",
  description: "自分のプロフィールを削除する",
  options: [{ ...numberOption, required: true }]
};

const randomCommand: CommandOption = {
  type: SubCommand,
  name: "random",
  description: "条件付きでランダムなプロフィールを表示する",
  options: [ownerOption, authorOption, contentOption]
};

const searchCommand: CommandOption = {
  type: SubCommand,
  name: "search",
  description: "プロフィールを検索して表示する",
  options: [orderOption, ownerOption, authorOption, contentOption, pageOption]
};

const showCommand: CommandOption = {
  type: SubCommand,
  name: "show",
  description: "プロフィールを指定して表示する",
  options: [{ ...numberOption, required: true }]
};

export const profileCommand: Command = {
  name: "profile",
  description: "プロフィールに関するコマンド",
  options: [createCommand, deleteCommand, randomCommand, searchCommand, showCommand]
};
