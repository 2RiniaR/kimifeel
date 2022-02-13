import { Message as RawMessage } from "discord.js";
import { CommandFragments } from "command-parser";
import { MessageImpl } from "./message";
import { MessageCommand } from "../../structures";

export class MessageCommandImpl extends MessageImpl implements MessageCommand {
  public constructor(raw: RawMessage, public readonly fragments: CommandFragments) {
    super(raw);
  }
}
