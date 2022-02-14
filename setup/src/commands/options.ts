import { CommandOption } from "./format";
import { Integer, String } from "./option-types";

export const pageOption: CommandOption = {
  type: Integer,
  name: "page",
  description: "ページ番号",
  min_value: 1
};

export const orderOption: CommandOption = {
  type: String,
  name: "order",
  description: "並び替え",
  choices: [
    { name: "新しい順", value: "latest" },
    { name: "古い順", value: "oldest" }
  ]
};
