import { Command } from "./format";
import { requestCommand } from "./request";
import { profileCommand } from "./profile";
import { userCommand } from "./user";
import { helpCommand } from "./help";

export const commands: Command[] = [profileCommand, requestCommand, userCommand, helpCommand];
