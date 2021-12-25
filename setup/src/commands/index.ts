import { Command } from "src/commands/format";
import { requestCommand } from "src/commands/request";
import { profileCommand } from "src/commands/profile";
import { userCommand } from "src/commands/user";

export const commands: Command[] = [profileCommand, requestCommand, userCommand];
