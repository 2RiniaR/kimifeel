import { Communicator } from "./communicator";
import { SystemMessage } from "../structures";

export interface HelpMessageGenerator {
  show(): SystemMessage;
}

export class HelpAction {
  constructor(private readonly messageGenerator: HelpMessageGenerator) {}

  public async show(communicator: Communicator) {
    communicator.getProps();
    const replyMessage = this.messageGenerator.show();
    await communicator.reply(replyMessage, { showOnlySender: true });
  }
}
