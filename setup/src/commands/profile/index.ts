import { Command } from "src/commands/format";
import { deleteCommand } from "src/commands/profile/delete";
import { randomCommand } from "src/commands/profile/random";
import { searchCommand } from "src/commands/profile/search";
import { showCommand } from "src/commands/profile/show";
import { createCommand } from "src/commands/profile/create";

export const profileCommand: Command = {
  name: "profile",
  description: "プロフィールに関するコマンド",
  options: [createCommand, deleteCommand, randomCommand, searchCommand, showCommand]
};
