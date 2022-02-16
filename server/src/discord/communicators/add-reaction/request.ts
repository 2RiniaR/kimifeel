import { ReactionCommunicator } from "./base";
import { RequestSentMessage } from "../../views";
import { ReadMessageFailedError } from "../../structures";
import { AcceptRequestProps, CancelRequestProps, DenyRequestProps } from "../../actions";

export class AcceptRequestCommunicator extends ReactionCommunicator<AcceptRequestProps> {
  getProps(): AcceptRequestProps {
    const systemMessage = this.reaction.message.readSystemMessage();
    const request = RequestSentMessage.fromMessage(systemMessage);
    if (request === undefined) throw new ReadMessageFailedError();
    return { index: request.index };
  }
}

export class CancelRequestCommunicator extends ReactionCommunicator<CancelRequestProps> {
  getProps(): CancelRequestProps {
    const systemMessage = this.reaction.message.readSystemMessage();
    const request = RequestSentMessage.fromMessage(systemMessage);
    if (request === undefined) throw new ReadMessageFailedError();
    return { index: request.index };
  }
}

export class DenyRequestCommunicator extends ReactionCommunicator<DenyRequestProps> {
  getProps(): DenyRequestProps {
    const systemMessage = this.reaction.message.readSystemMessage();
    const request = RequestSentMessage.fromMessage(systemMessage);
    if (request === undefined) throw new ReadMessageFailedError();
    return { index: request.index };
  }
}
