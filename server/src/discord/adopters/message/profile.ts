import { MessageCommandCommunicator } from "./base";
import {
  CreateProfileParams,
  ProfileCondition,
  ProfileSpecifier,
  SearchProfileParams
} from "../../../app";
import { interpretCommand } from "../../../command-parser";
import { parameterTypes } from "./command";
import { ArgumentFormatInvalidError } from "../../actions/errors";

export class CreateProfileCommunicator extends MessageCommandCommunicator<CreateProfileParams> {
  private static readonly format = {
    arguments: [{ name: "内容", type: "string" }],
    options: {}
  } as const;

  public getProps(): CreateProfileParams {
    const interpret = interpretCommand(this.command.fragments, CreateProfileCommunicator.format, parameterTypes);
    return {
      content: interpret.arguments[0]
    };
  }
}

export class DeleteProfileCommunicator extends MessageCommandCommunicator<ProfileSpecifier> {
  private static readonly format = {
    arguments: [{ name: "プロフィールの番号", type: "integer" }],
    options: {}
  } as const;

  public getProps(): ProfileSpecifier {
    const interpret = interpretCommand(this.command.fragments, DeleteProfileCommunicator.format, parameterTypes);
    return {
      index: interpret.arguments[0]
    };
  }
}

export class RandomProfileCommunicator extends MessageCommandCommunicator<ProfileCondition> {
  private static readonly format = {
    arguments: [],
    options: {
      owner: { name: "対象ユーザーのID", type: "userId" },
      author: { name: "プロフィールを書いたユーザーのID", type: "userId" },
      content: { name: "含まれている文字列", type: "string" }
    }
  } as const;

  public getProps(): ProfileCondition {
    const interpret = interpretCommand(this.command.fragments, RandomProfileCommunicator.format, parameterTypes);
    return {
      owner: interpret.options.owner ? { discordId: interpret.options.owner } : undefined,
      author: interpret.options.author ? { discordId: interpret.options.author } : undefined,
      content: interpret.options.content
    };
  }
}

export class SearchProfileCommunicator extends MessageCommandCommunicator<SearchProfileParams> {
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

  public getProps(): SearchProfileParams {
    const interpret = interpretCommand(this.command.fragments, SearchProfileCommunicator.format, parameterTypes);

    const order = interpret.options.order;
    if (order && order !== "latest" && order !== "oldest") {
      throw new ArgumentFormatInvalidError("order", "latest または oldest");
    }

    return {
      order: (order as "oldest" | "latest") ?? "latest",
      owner: interpret.options.owner ? { discordId: interpret.options.owner } : undefined,
      author: interpret.options.author ? { discordId: interpret.options.author } : undefined,
      content: interpret.options.content,
      page: interpret.options.page ?? SearchProfileCommunicator.defaultPage
    };
  }
}

export class ShowProfileCommunicator extends MessageCommandCommunicator<ProfileSpecifier> {
  private static readonly format = {
    arguments: [{ name: "プロフィールの番号", type: "integer" }],
    options: {}
  } as const;

  public getProps(): ProfileSpecifier {
    const interpret = interpretCommand(this.command.fragments, ShowProfileCommunicator.format, parameterTypes);
    return {
      index: interpret.arguments[0]
    };
  }
}
