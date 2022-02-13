import { CommandFragments } from "../../command-parser";
import { Message } from "./message";

export interface MessageCommand extends Message {
  fragments: CommandFragments;
}
