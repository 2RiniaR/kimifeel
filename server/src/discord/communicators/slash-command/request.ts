import { SlashCommandCommunicator } from "./base";
import {
  AcceptRequestProps,
  CancelRequestProps,
  DenyRequestProps,
  SearchRequestProps,
  SendRequestProps,
  ShowRequestProps
} from "../../actions";
import { InvalidFormatError } from "../../structures";

export class AcceptRequestCommunicator extends SlashCommandCommunicator<AcceptRequestProps> {
  public getProps(): AcceptRequestProps {
    return {
      index: this.command.getInteger("number")
    };
  }
}

export class CancelRequestCommunicator extends SlashCommandCommunicator<CancelRequestProps> {
  public getProps(): CancelRequestProps {
    return {
      index: this.command.getInteger("number")
    };
  }
}

export class DenyRequestCommunicator extends SlashCommandCommunicator<DenyRequestProps> {
  public getProps(): DenyRequestProps {
    return {
      index: this.command.getInteger("number")
    };
  }
}

export class SearchRequestCommunicator extends SlashCommandCommunicator<SearchRequestProps> {
  private static readonly defaultPage = 1;
  private static readonly defaultStatus = "received";
  private static readonly defaultOrder = "latest";

  public getProps(): SearchRequestProps {
    const genre = this.command.getStringOptional("genre");
    if (genre && genre !== "received" && genre !== "sent") {
      throw new InvalidFormatError("genre", "received または sent");
    }

    const order = this.command.getStringOptional("order");
    if (order && order !== "latest" && order !== "oldest") {
      throw new InvalidFormatError("order", "latest または oldest");
    }

    return {
      status: (genre as "received" | "sent" | undefined) ?? SearchRequestCommunicator.defaultStatus,
      order: (order as "latest" | "oldest" | undefined) ?? SearchRequestCommunicator.defaultOrder,
      page: this.command.getIntegerOptional("page") ?? SearchRequestCommunicator.defaultPage,
      applicantId: this.command.getUserOptional("applicant")?.id,
      targetId: this.command.getUserOptional("target")?.id,
      content: this.command.getStringOptional("content")
    };
  }
}

export class SendRequestCommunicator extends SlashCommandCommunicator<SendRequestProps> {
  public getProps(): SendRequestProps {
    return {
      targetId: this.command.getUser("target").id,
      content: this.command.getString("content")
    };
  }
}

export class ShowRequestCommunicator extends SlashCommandCommunicator<ShowRequestProps> {
  public getProps(): ShowRequestProps {
    return {
      index: this.command.getInteger("number")
    };
  }
}
