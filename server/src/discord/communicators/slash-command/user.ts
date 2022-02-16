import { SlashCommandCommunicator } from "./base";
import { ConfigUserProps, ShowUserStatsProps } from "../../actions";

export class RegisterUserCommunicator extends SlashCommandCommunicator {
  public getProps() {
    /* do nothing */
  }
}

export class ShowUserStatsCommunicator extends SlashCommandCommunicator<ShowUserStatsProps> {
  public getProps(): ShowUserStatsProps {
    return {
      userId: this.command.getUser("target").id
    };
  }
}

export class ConfigUserCommunicator extends SlashCommandCommunicator<ConfigUserProps> {
  public getProps(): ConfigUserProps {
    return {
      enableMention: this.command.getBooleanOptional("enable-mention")
    };
  }
}
