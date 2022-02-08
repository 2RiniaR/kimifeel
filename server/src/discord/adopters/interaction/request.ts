import { CreateRequestParams, RequestSpecifier, SearchRequestParams } from "../../../app";
import { SlashCommandCommunicator } from "./base";

export class AcceptRequestAction extends SlashCommandCommunicator<RequestSpecifier> {
  public getProps(): RequestSpecifier {
    return {
      index: this.command.getInteger("number")
    };
  }
}

export class CancelRequestAction extends SlashCommandCommunicator<RequestSpecifier> {
  public getProps(): RequestSpecifier {
    return {
      index: this.command.getInteger("number")
    };
  }
}

export class DenyRequestAction extends SlashCommandCommunicator<RequestSpecifier> {
  public getProps(): RequestSpecifier {
    return {
      index: this.command.getInteger("number")
    };
  }
}

export class SearchRequestAction extends SlashCommandCommunicator<SearchRequestParams> {
  private static readonly defaultPage = 1;
  private static readonly defaultStatus = "received";
  private static readonly defaultOrder = "latest";

  public getProps(): SearchRequestParams {
    const genre = this.command.getStringOptional("genre");
    const order = this.command.getStringOptional("order");
    const page = this.command.getIntegerOptional("page");
    const applicant = this.command.getUserOptional("applicant");
    const target = this.command.getUserOptional("target");
    return {
      status: (genre as "received" | "sent" | undefined) ?? SearchRequestAction.defaultStatus,
      order: (order as "latest" | "oldest" | undefined) ?? SearchRequestAction.defaultOrder,
      page: page ?? SearchRequestAction.defaultPage,
      applicant: applicant ? { discordId: applicant.id } : undefined,
      target: target ? { discordId: target.id } : undefined,
      content: this.command.getStringOptional("content")
    };
  }
}

export class SendRequestAction extends SlashCommandCommunicator<CreateRequestParams> {
  public getProps(): CreateRequestParams {
    return {
      target: this.command.getUser("target"),
      content: this.command.getString("content")
    };
  }
}

export class ShowRequestAction extends SlashCommandCommunicator<RequestSpecifier> {
  public getProps(): RequestSpecifier {
    return {
      index: this.command.getInteger("number")
    };
  }
}
