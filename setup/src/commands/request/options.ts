import { CommandOption } from "src/commands/format";
import { Integer, String, User } from "src/option-types";

export const numberOption: CommandOption = {
  type: Integer,
  name: "number",
  description: "リクエスト番号",
  min_value: 0
};

export const genreOption: CommandOption = {
  type: String,
  name: "genre",
  description: "受信済み・送信済み",
  choices: [
    { name: "受信済み", value: "received" },
    { name: "送信済み", value: "sent" }
  ]
};

export const contentOption: CommandOption = {
  type: String,
  name: "content",
  description: "プロフィールの内容"
};

export const targetOption: CommandOption = {
  type: User,
  name: "target",
  description: "リクエストの送信先ユーザー"
};

export const applicantOption: CommandOption = {
  type: User,
  name: "applicant",
  description: "リクエストを送信したユーザー"
};
