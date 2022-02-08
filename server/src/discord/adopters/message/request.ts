import { CreateRequestParams, RequestSpecifier, SearchRequestParams } from "../../../app";
import { parameterTypes } from "./command";
import { ArgumentFormatInvalidError } from "../../actions/errors";
import { MessageCommandCommunicator } from "./base";
import { interpretCommand } from "../../../command-parser";

export class AcceptRequestCommunicator extends MessageCommandCommunicator<RequestSpecifier> {
  private static readonly format = {
    arguments: [{ name: "リクエストの番号", type: "integer" }],
    options: {}
  } as const;

  public getProps(): RequestSpecifier {
    const interpret = interpretCommand(this.command.fragments, AcceptRequestCommunicator.format, parameterTypes);
    return {
      index: interpret.arguments[0]
    };
  }
}

export class CancelRequestCommunicator extends MessageCommandCommunicator<RequestSpecifier> {
  private static readonly format = {
    arguments: [{ name: "リクエストの番号", type: "integer" }],
    options: {}
  } as const;

  public getProps(): RequestSpecifier {
    const interpret = interpretCommand(this.command.fragments, CancelRequestCommunicator.format, parameterTypes);
    return {
      index: interpret.arguments[0]
    };
  }
}

export class DenyRequestCommunicator extends MessageCommandCommunicator<RequestSpecifier> {
  private static readonly format = {
    arguments: [{ name: "リクエストの番号", type: "integer" }],
    options: {}
  } as const;

  public getProps(): RequestSpecifier {
    const interpret = interpretCommand(this.command.fragments, DenyRequestCommunicator.format, parameterTypes);
    return {
      index: interpret.arguments[0]
    };
  }
}

export class SearchRequestCommunicator extends MessageCommandCommunicator<SearchRequestParams> {
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

  public getProps(): SearchRequestParams {
    const interpret = interpretCommand(this.command.fragments, SearchRequestCommunicator.format, parameterTypes);

    const genre = interpret.options.genre;
    if (genre && genre !== "received" && genre !== "sent") {
      throw new ArgumentFormatInvalidError("genre", "received または sent");
    }

    const order = interpret.options.order;
    if (order && order !== "latest" && order !== "oldest") {
      throw new ArgumentFormatInvalidError("order", "latest または oldest");
    }

    return {
      status: (genre as "received" | "sent" | undefined) ?? "received",
      order: (order as "oldest" | "latest" | undefined) ?? "latest",
      page: interpret.options.page ?? SearchRequestCommunicator.defaultPage,
      target: interpret.options.target ? { discordId: interpret.options.target } : undefined,
      applicant: interpret.options.applicant ? { discordId: interpret.options.applicant } : undefined,
      content: interpret.options.content
    };
  }
}

export class SendRequestCommunicator extends MessageCommandCommunicator<CreateRequestParams> {
  private static readonly format = {
    arguments: [
      { name: "送信先ユーザーのID", type: "userId" },
      { name: "内容", type: "string" }
    ],
    options: {}
  } as const;

  public getProps(): CreateRequestParams {
    const interpret = interpretCommand(this.command.fragments, SendRequestCommunicator.format, parameterTypes);
    return {
      target: { discordId: interpret.arguments[0] },
      content: interpret.arguments[1]
    };
  }
}

export class ShowRequestCommunicator extends MessageCommandCommunicator<RequestSpecifier> {
  private static readonly format = {
    arguments: [{ name: "番号", type: "integer" }],
    options: {}
  } as const;

  public getProps(): RequestSpecifier {
    const interpret = interpretCommand(this.command.fragments, ShowRequestCommunicator.format, parameterTypes);
    return {
      index: interpret.arguments[0]
    };
  }
}
