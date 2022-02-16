import { CommandFragments } from "../../command-parser";
import { Message } from "./message";

export interface MessageCommand {
  message: Message;
  fragments: CommandFragments;
}
