import { MessageCommandCommunicator } from "./base";
import {
  CreateProfileProps,
  DeleteProfileProps,
  RandomProfileProps,
  SearchProfileProps,
  ShowProfileProps
} from "../../actions";
import { InvalidFormatError } from "../../structures";
import { tryGetValue } from "helpers/object";

export class CreateProfileCommunicator extends MessageCommandCommunicator<CreateProfileProps> {
  public getProps(): CreateProfileProps {
    this.checkArgsCount(1);
    this.checkOptionsKey([]);

    return {
      content: this.command.fragments.arguments[0]
    };
  }
}

export class DeleteProfileCommunicator extends MessageCommandCommunicator<DeleteProfileProps> {
  public getProps(): DeleteProfileProps {
    this.checkArgsCount(1);
    this.checkOptionsKey([]);

    const index = parseInt(this.command.fragments.arguments[0]);
    if (isNaN(index)) throw new InvalidFormatError("引数1", "整数");
    return { index };
  }
}

export class RandomProfileCommunicator extends MessageCommandCommunicator<RandomProfileProps> {
  public getProps(): RandomProfileProps {
    this.checkArgsCount(0);
    this.checkOptionsKey(["owner", "author", "content"]);

    const options = this.command.fragments.options;
    return {
      ownerId: tryGetValue(options, "owner"),
      authorId: tryGetValue(options, "author"),
      content: tryGetValue(options, "content")
    };
  }
}

export class SearchProfileCommunicator extends MessageCommandCommunicator<SearchProfileProps> {
  private static readonly defaultPage = 1;

  public getProps(): SearchProfileProps {
    this.checkArgsCount(0);
    this.checkOptionsKey(["owner", "author", "content", "page", "order"]);

    const options = this.command.fragments.options;
    const order = tryGetValue(options, "order");
    if (order !== undefined && order !== "latest" && order !== "oldest") {
      throw new InvalidFormatError("order", "latest または oldest");
    }

    const pageRaw = tryGetValue(options, "page");
    let page: number | undefined = undefined;
    if (pageRaw !== undefined) {
      page = parseInt(pageRaw);
      if (isNaN(page)) throw new InvalidFormatError("page", "整数");
    }

    return {
      order: order ?? "latest",
      ownerId: tryGetValue(options, "owner"),
      authorId: tryGetValue(options, "author"),
      content: tryGetValue(options, "content"),
      page: page ?? SearchProfileCommunicator.defaultPage
    };
  }
}

export class ShowProfileCommunicator extends MessageCommandCommunicator<ShowProfileProps> {
  public getProps(): ShowProfileProps {
    this.checkArgsCount(1);
    this.checkOptionsKey([]);

    const index = parseInt(this.command.fragments.arguments[0]);
    if (isNaN(index)) throw new InvalidFormatError("引数1", "整数");
    return { index };
  }
}
