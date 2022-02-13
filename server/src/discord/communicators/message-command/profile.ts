import { interpretCommand } from "command-parser";
import { MessageCommandCommunicator } from "./base";
import { parameterTypes } from "./command";
import {
  CreateProfileProps,
  DeleteProfileProps,
  RandomProfileProps,
  SearchProfileProps,
  ShowProfileProps
} from "../../actions";
import { InvalidFormatError } from "../../structures";
import { withConvertParseCommandErrors } from "./error";

export class CreateProfileCommunicator extends MessageCommandCommunicator<CreateProfileProps> {
  private static readonly format = {
    arguments: [{ name: "内容", type: "string" }],
    options: {}
  } as const;

  public getProps(): CreateProfileProps {
    const interpret = withConvertParseCommandErrors.invoke(() =>
      interpretCommand(this.message.fragments, CreateProfileCommunicator.format, parameterTypes)
    );
    return {
      content: interpret.arguments[0]
    };
  }
}

export class DeleteProfileCommunicator extends MessageCommandCommunicator<DeleteProfileProps> {
  private static readonly format = {
    arguments: [{ name: "プロフィールの番号", type: "integer" }],
    options: {}
  } as const;

  public getProps(): DeleteProfileProps {
    const interpret = withConvertParseCommandErrors.invoke(() =>
      interpretCommand(this.message.fragments, DeleteProfileCommunicator.format, parameterTypes)
    );
    return {
      index: interpret.arguments[0]
    };
  }
}

export class RandomProfileCommunicator extends MessageCommandCommunicator<RandomProfileProps> {
  private static readonly format = {
    arguments: [],
    options: {
      owner: { name: "対象ユーザーのID", type: "userId" },
      author: { name: "プロフィールを書いたユーザーのID", type: "userId" },
      content: { name: "含まれている文字列", type: "string" }
    }
  } as const;

  public getProps(): RandomProfileProps {
    const interpret = withConvertParseCommandErrors.invoke(() =>
      interpretCommand(this.message.fragments, RandomProfileCommunicator.format, parameterTypes)
    );
    return {
      ownerId: interpret.options.owner,
      authorId: interpret.options.author,
      content: interpret.options.content
    };
  }
}

export class SearchProfileCommunicator extends MessageCommandCommunicator<SearchProfileProps> {
  private static readonly defaultPage = 1;
  private static readonly format = {
    arguments: [],
    options: {
      owner: { name: "対象ユーザーのID", type: "userId" },
      author: { name: "プロフィールを書いたユーザーのID", type: "userId" },
      content: { name: "含まれている文字列", type: "string" },
      page: { name: "ページ", type: "integer" },
      order: { name: "並び替え", type: "string" }
    }
  } as const;

  public getProps(): SearchProfileProps {
    const interpret = withConvertParseCommandErrors.invoke(() =>
      interpretCommand(this.message.fragments, SearchProfileCommunicator.format, parameterTypes)
    );

    const order = interpret.options.order;
    if (order && order !== "latest" && order !== "oldest") {
      throw new InvalidFormatError("order", "latest または oldest");
    }

    return {
      order: (order as "oldest" | "latest") ?? "latest",
      ownerId: interpret.options.owner,
      authorId: interpret.options.author,
      content: interpret.options.content,
      page: interpret.options.page ?? SearchProfileCommunicator.defaultPage
    };
  }
}

export class ShowProfileCommunicator extends MessageCommandCommunicator<ShowProfileProps> {
  private static readonly format = {
    arguments: [{ name: "プロフィールの番号", type: "integer" }],
    options: {}
  } as const;

  public getProps(): ShowProfileProps {
    const interpret = withConvertParseCommandErrors.invoke(() =>
      interpretCommand(this.message.fragments, ShowProfileCommunicator.format, parameterTypes)
    );
    return {
      index: interpret.arguments[0]
    };
  }
}
