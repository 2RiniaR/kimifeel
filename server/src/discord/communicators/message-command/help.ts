import { MessageCommandCommunicator } from "./base";

export class HelpCommunicator extends MessageCommandCommunicator {
  public getProps() {
    this.checkArgsCount(0);
    this.checkOptionsKey([]);
  }
}
