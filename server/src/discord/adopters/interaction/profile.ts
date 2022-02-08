import { SlashCommandCommunicator } from "./base";
import { CreateProfileParams, ProfileCondition, ProfileSpecifier, SearchProfileParams } from "../../../app";

export class CreateProfileCommunicator extends SlashCommandCommunicator<CreateProfileParams> {
  public getProps(): CreateProfileParams {
    return {
      content: this.command.getString("content")
    };
  }
}

export class DeleteProfileCommunicator extends SlashCommandCommunicator<ProfileSpecifier> {
  public getProps(): ProfileSpecifier {
    return {
      index: this.command.getInteger("number")
    };
  }
}

export class RandomProfileCommunicator extends SlashCommandCommunicator<ProfileCondition> {
  public getProps(): ProfileCondition {
    const owner = this.command.getUserOptional("owner");
    const author = this.command.getUserOptional("author");
    return {
      owner: owner ? { discordId: owner.id } : undefined,
      author: author ? { discordId: author.id } : undefined,
      content: this.command.getStringOptional("content")
    };
  }
}

export class SearchProfileCommunicator extends SlashCommandCommunicator<SearchProfileParams> {
  private static readonly defaultPage = 1;
  private static readonly defaultOrder = "latest";

  public getProps(): SearchProfileParams {
    const order = this.command.getStringOptional("order");
    const page = this.command.getIntegerOptional("page");
    const owner = this.command.getUserOptional("owner");
    const author = this.command.getUserOptional("author");
    return {
      order: (order as "latest" | "oldest" | undefined) ?? SearchProfileCommunicator.defaultOrder,
      page: page ?? SearchProfileCommunicator.defaultPage,
      owner: owner ? { discordId: owner.id } : undefined,
      author: author ? { discordId: author.id } : undefined,
      content: this.command.getStringOptional("content")
    };
  }
}

export class ShowProfileCommunicator extends SlashCommandCommunicator<ProfileSpecifier> {
  public getProps(): ProfileSpecifier {
    return {
      index: this.command.getInteger("number")
    };
  }
}
