import { Command } from "src/commands/format";
import { acceptCommand } from "src/commands/request/accept";
import { cancelCommand } from "src/commands/request/cancel";
import { denyCommand } from "src/commands/request/deny";
import { sendCommand } from "src/commands/request/send";
import { searchCommand } from "src/commands/request/search";
import { showCommand } from "src/commands/request/show";

export const requestCommand: Command = {
  name: "request",
  description: "リクエストに関するコマンド",
  options: [acceptCommand, cancelCommand, denyCommand, sendCommand, searchCommand, showCommand]
};
