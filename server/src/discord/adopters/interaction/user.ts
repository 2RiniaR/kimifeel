import { UserConfigParams, UserSpecifier } from "../../../app";
import { SlashCommandCommunicator } from "./base";

export class ShowStatsUserAction extends SlashCommandCommunicator<UserSpecifier> {
  public getProps(): UserSpecifier {
    return {
      discordId: this.command.getUser("target").id
    };
  }
}

export class ConfigUserAction extends SlashCommandCommunicator<UserConfigParams> {
  public getProps(): UserConfigParams {
    return {
      enableMention: this.command.getBooleanOptional("enable-mention")
    };
  }
}
