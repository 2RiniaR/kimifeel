import { Integer, SubCommand, User, String } from "./option-types";
import { Command, CommandOption } from "./format";
import { orderOption, pageOption } from "./options";

const numberOption: CommandOption = {
  type: Integer,
  name: "number",
  description: "リクエスト番号",
  min_value: 1
};

const genreOption: CommandOption = {
  type: String,
  name: "genre",
  description: "受信済み・送信済み",
  choices: [
    { name: "受信済み", value: "received" },
    { name: "送信済み", value: "sent" }
  ]
};

const contentOption: CommandOption = {
  type: String,
  name: "content",
  description: "プロフィールの内容"
};

const targetOption: CommandOption = {
  type: User,
  name: "target",
  description: "リクエストの送信先ユーザー"
};

const applicantOption: CommandOption = {
  type: User,
  name: "applicant",
  description: "リクエストを送信したユーザー"
};

const acceptCommand: CommandOption = {
  type: SubCommand,
  name: "accept",
  description: "リクエストを承認する",
  options: [{ ...numberOption, required: true }]
};

const cancelCommand: CommandOption = {
  type: SubCommand,
  name: "cancel",
  description: "リクエストを取り消す",
  options: [{ ...numberOption, required: true }]
};

const denyCommand: CommandOption = {
  type: SubCommand,
  name: "deny",
  description: "リクエストを拒否する",
  options: [{ ...numberOption, required: true }]
};

const searchCommand: CommandOption = {
  type: SubCommand,
  name: "search",
  description: "リクエストを検索して表示する",
  options: [genreOption, pageOption, orderOption, contentOption, applicantOption, targetOption]
};

const sendCommand: CommandOption = {
  type: SubCommand,
  name: "send",
  description: "リクエストを送信する",
  options: [
    { ...targetOption, required: true },
    { ...contentOption, required: true }
  ]
};

const showCommand: CommandOption = {
  type: SubCommand,
  name: "show",
  description: "リクエストを指定して表示する",
  options: [{ ...numberOption, required: true }]
};

export const requestCommand: Command = {
  name: "request",
  description: "リクエストに関するコマンド",
  options: [acceptCommand, cancelCommand, denyCommand, sendCommand, searchCommand, showCommand]
};
