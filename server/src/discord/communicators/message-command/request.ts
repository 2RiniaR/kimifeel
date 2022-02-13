import { interpretCommand } from "command-parser";
import { parameterTypes } from "./command";
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
import { withConvertParseCommandErrors } from "./error";

export class AcceptRequestCommunicator extends MessageCommandCommunicator<AcceptRequestProps> {
  private static readonly format = {
    arguments: [{ name: "リクエストの番号", type: "integer" }],
    options: {}
  } as const;

  public getProps(): AcceptRequestProps {
    const interpret = withConvertParseCommandErrors.invoke(() =>
      interpretCommand(this.message.fragments, AcceptRequestCommunicator.format, parameterTypes)
    );
    return {
      index: interpret.arguments[0]
    };
  }
}

export class CancelRequestCommunicator extends MessageCommandCommunicator<CancelRequestProps> {
  private static readonly format = {
    arguments: [{ name: "リクエストの番号", type: "integer" }],
    options: {}
  } as const;

  public getProps(): CancelRequestProps {
    const interpret = withConvertParseCommandErrors.invoke(() =>
      interpretCommand(this.message.fragments, CancelRequestCommunicator.format, parameterTypes)
    );
    return {
      index: interpret.arguments[0]
    };
  }
}

export class DenyRequestCommunicator extends MessageCommandCommunicator<DenyRequestProps> {
  private static readonly format = {
    arguments: [{ name: "リクエストの番号", type: "integer" }],
    options: {}
  } as const;

  public getProps(): DenyRequestProps {
    const interpret = withConvertParseCommandErrors.invoke(() =>
      interpretCommand(this.message.fragments, DenyRequestCommunicator.format, parameterTypes)
    );
    return {
      index: interpret.arguments[0]
    };
  }
}

export class SearchRequestCommunicator extends MessageCommandCommunicator<SearchRequestProps> {
  private static readonly defaultPage = 1;
  private static readonly format = {
    arguments: [],
    options: {
      genre: { name: "送信済み・受信済み", type: "string" },
      page: { name: "ページ", type: "integer" },
      order: { name: "並び替え", type: "string" },
      applicant: { name: "送信元ユーザー", type: "userId" },
      target: { name: "送信先ユーザー", type: "userId" },
      content: { name: "含まれる内容", type: "string" }
    }
  } as const;

  public getProps(): SearchRequestProps {
    const interpret = withConvertParseCommandErrors.invoke(() =>
      interpretCommand(this.message.fragments, SearchRequestCommunicator.format, parameterTypes)
    );

    const genre = interpret.options.genre;
    if (genre && genre !== "received" && genre !== "sent") {
      throw new InvalidFormatError("genre", "received または sent");
    }

    const order = interpret.options.order;
    if (order && order !== "latest" && order !== "oldest") {
      throw new InvalidFormatError("order", "latest または oldest");
    }

    return {
      status: (genre as "received" | "sent" | undefined) ?? "received",
      order: (order as "oldest" | "latest" | undefined) ?? "latest",
      page: interpret.options.page ?? SearchRequestCommunicator.defaultPage,
      targetId: interpret.options.target,
      applicantId: interpret.options.applicant,
      content: interpret.options.content
    };
  }
}

export class SendRequestCommunicator extends MessageCommandCommunicator<SendRequestProps> {
  private static readonly format = {
    arguments: [
      { name: "送信先ユーザーのID", type: "userId" },
      { name: "内容", type: "string" }
    ],
    options: {}
  } as const;

  public getProps(): SendRequestProps {
    const interpret = withConvertParseCommandErrors.invoke(() =>
      interpretCommand(this.message.fragments, SendRequestCommunicator.format, parameterTypes)
    );
    return {
      targetId: interpret.arguments[0],
      content: interpret.arguments[1]
    };
  }
}

export class ShowRequestCommunicator extends MessageCommandCommunicator<ShowRequestProps> {
  private static readonly format = {
    arguments: [{ name: "番号", type: "integer" }],
    options: {}
  } as const;

  public getProps(): ShowRequestProps {
    const interpret = withConvertParseCommandErrors.invoke(() =>
      interpretCommand(this.message.fragments, ShowRequestCommunicator.format, parameterTypes)
    );
    return {
      index: interpret.arguments[0]
    };
  }
}
