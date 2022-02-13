import { SlashCommandCommunicator } from "./base";
import {
  CreateProfileProps,
  DeleteProfileProps,
  RandomProfileProps,
  SearchProfileProps,
  ShowProfileProps
} from "../../actions";
import { InvalidFormatError } from "../../structures";

export class CreateProfileCommunicator extends SlashCommandCommunicator<CreateProfileProps> {
  public getProps(): CreateProfileProps {
    return {
      content: this.command.getString("content")
    };
  }
}

export class DeleteProfileCommunicator extends SlashCommandCommunicator<DeleteProfileProps> {
  public getProps(): DeleteProfileProps {
    return {
      index: this.command.getInteger("number")
    };
  }
}

export class RandomProfileCommunicator extends SlashCommandCommunicator<RandomProfileProps> {
  public getProps(): RandomProfileProps {
    return {
      ownerId: this.command.getUserOptional("owner")?.id,
      authorId: this.command.getUserOptional("author")?.id,
      content: this.command.getStringOptional("content")
    };
  }
}

export class SearchProfileCommunicator extends SlashCommandCommunicator<SearchProfileProps> {
  private static readonly defaultPage = 1;
  private static readonly defaultOrder = "latest";

  public getProps(): SearchProfileProps {
    const order = this.command.getStringOptional("order");
    if (order && order !== "latest" && order !== "oldest") {
      throw new InvalidFormatError("order", "latest または oldest");
    }

    return {
      order: (order as "latest" | "oldest" | undefined) ?? SearchProfileCommunicator.defaultOrder,
      page: this.command.getIntegerOptional("page") ?? SearchProfileCommunicator.defaultPage,
      ownerId: this.command.getUserOptional("owner")?.id,
      authorId: this.command.getUserOptional("author")?.id,
      content: this.command.getStringOptional("content")
    };
  }
}

export class ShowProfileCommunicator extends SlashCommandCommunicator<ShowProfileProps> {
  public getProps(): ShowProfileProps {
    return {
      index: this.command.getInteger("number")
    };
  }
}
