import { CommandOption } from "src/commands/format";
import { Integer, String, User } from "src/option-types";

export const numberOption: CommandOption = {
  type: Integer,
  name: "number",
  description: "プロフィール番号",
  min_value: 0
};

export const ownerOption: CommandOption = {
  type: User,
  name: "owner",
  description: "プロフィールを所持しているユーザー"
};

export const authorOption: CommandOption = {
  type: User,
  name: "author",
  description: "プロフィールを書いたユーザー"
};

export const contentOption: CommandOption = {
  type: String,
  name: "content",
  description: "含まれている文字列"
};
