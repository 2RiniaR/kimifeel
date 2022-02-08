import { UserConfigParams, UserSpecifier } from "../../../app";
import { parameterTypes } from "./command";
import { ArgumentFormatInvalidError } from "../../actions/errors";
import { MessageCommandCommunicator } from "./base";
import { interpretCommand } from "../../../command-parser";

export class ShowStatsUserAction extends MessageCommandCommunicator<UserSpecifier> {
  private static readonly format = {
    arguments: [{ name: "ユーザーのID", type: "userId" }],
    options: {}
  } as const;

  public getProps(): UserSpecifier {
    const interpret = interpretCommand(this.command.fragments, ShowStatsUserAction.format, parameterTypes);
    return {
      discordId: interpret.arguments[0]
    };
  }
}

export class ConfigUserAction extends MessageCommandCommunicator<UserConfigParams> {
  private static readonly format = {
    arguments: [],
    options: {
      enableMention: {
        name: "メンションを有効にするか",
        type: "string"
      }
    }
  } as const;
  private static readonly trueKeyWords = ["yes", "on", "true"];
  private static readonly falseKeyWords = ["no", "off", "false"];

  public getProps(): UserConfigParams {
    const interpret = interpretCommand(this.command.fragments, ConfigUserAction.format, parameterTypes);

    let enableMention: boolean | undefined = undefined;
    if (interpret.options.enableMention) {
      const keyWord = interpret.options.enableMention.toLowerCase();
      if (ConfigUserAction.trueKeyWords.includes(keyWord)) enableMention = true;
      else if (ConfigUserAction.falseKeyWords.includes(keyWord)) enableMention = false;
      else throw new ArgumentFormatInvalidError("enableMention", "yes/on/true/no/off/false");
    }

    return {
      enableMention
    };
  }
}
