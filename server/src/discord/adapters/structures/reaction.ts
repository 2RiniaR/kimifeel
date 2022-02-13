import { Reaction, Message } from "../../structures";

export class ReactionImpl implements Reaction {
  public constructor(public readonly message: Message) {}
}
