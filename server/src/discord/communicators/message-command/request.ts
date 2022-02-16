import { MessageCommandCommunicator } from "./base";
import {
  AcceptRequestProps,
  CancelRequestProps,
  DenyRequestProps,
  SearchRequestProps,
  SendRequestProps,
  ShowRequestProps
} from "../../actions";
import { InvalidFormatError } from "../../structures";
import { tryGetValue } from "helpers/object";

export class AcceptRequestCommunicator extends MessageCommandCommunicator<AcceptRequestProps> {
  public getProps(): AcceptRequestProps {
    this.checkArgsCount(1);
    this.checkOptionsKey([]);

    const index = parseInt(this.command.fragments.arguments[0]);
    if (isNaN(index)) throw new InvalidFormatError("引数1", "整数");
    return { index };
  }
}

export class CancelRequestCommunicator extends MessageCommandCommunicator<CancelRequestProps> {
  public getProps(): CancelRequestProps {
    this.checkArgsCount(1);
    this.checkOptionsKey([]);

    const index = parseInt(this.command.fragments.arguments[0]);
    if (isNaN(index)) throw new InvalidFormatError("引数1", "整数");
    return { index };
  }
}

export class DenyRequestCommunicator extends MessageCommandCommunicator<DenyRequestProps> {
  public getProps(): DenyRequestProps {
    this.checkArgsCount(1);
    this.checkOptionsKey([]);

    const index = parseInt(this.command.fragments.arguments[0]);
    if (isNaN(index)) throw new InvalidFormatError("引数1", "整数");
    return { index };
  }
}

export class SearchRequestCommunicator extends MessageCommandCommunicator<SearchRequestProps> {
  private static readonly defaultPage = 1;

  public getProps(): SearchRequestProps {
    this.checkArgsCount(0);
    this.checkOptionsKey(["applicant", "target", "content", "page", "order", "genre"]);

    const options = this.command.fragments.options;
    const order = tryGetValue(options, "order");
    if (order !== undefined && order !== "latest" && order !== "oldest") {
      throw new InvalidFormatError("order", "latest または oldest");
    }

    const genre = tryGetValue(options, "genre");
    if (genre !== undefined && genre !== "sent" && genre !== "received") {
      throw new InvalidFormatError("order", "sent または received");
    }

    const pageRaw = tryGetValue(options, "page");
    let page: number | undefined = undefined;
    if (pageRaw !== undefined) {
      page = parseInt(pageRaw);
      if (isNaN(page)) throw new InvalidFormatError("page", "整数");
    }

    return {
      order: order ?? "latest",
      status: genre ?? "received",
      applicantId: tryGetValue(options, "applicant"),
      targetId: tryGetValue(options, "target"),
      content: tryGetValue(options, "content"),
      page: page ?? SearchRequestCommunicator.defaultPage
    };
  }
}

export class SendRequestCommunicator extends MessageCommandCommunicator<SendRequestProps> {
  public getProps(): SendRequestProps {
    this.checkArgsCount(2);
    this.checkOptionsKey([]);

    const args = this.command.fragments.arguments;
    return {
      targetId: args[0],
      content: args[1]
    };
  }
}

export class ShowRequestCommunicator extends MessageCommandCommunicator<ShowRequestProps> {
  public getProps(): ShowRequestProps {
    this.checkArgsCount(1);
    this.checkOptionsKey([]);

    const index = parseInt(this.command.fragments.arguments[0]);
    if (isNaN(index)) throw new InvalidFormatError("引数1", "整数");
    return { index };
  }
}
