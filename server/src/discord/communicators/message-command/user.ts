import { interpretCommand } from "command-parser";
import { parameterTypes } from "./command";
import { MessageCommandCommunicator } from "./base";
import { ConfigUserProps, ShowUserStatsProps } from "../../actions";
import { InvalidFormatError } from "../../structures";
import { withConvertParseCommandErrors } from "./error";

export class RegisterUserCommunicator extends MessageCommandCommunicator {
  public getProps() {
    /* do nothing */
  }
}

export class ShowUserStatsCommunicator extends MessageCommandCommunicator<ShowUserStatsProps> {
  private static readonly format = {
    arguments: [{ name: "ユーザーのID", type: "userId" }],
    options: {}
  } as const;

  public getProps(): ShowUserStatsProps {
    const interpret = withConvertParseCommandErrors.invoke(() =>
      interpretCommand(this.message.fragments, ShowUserStatsCommunicator.format, parameterTypes)
    );
    return {
      userId: interpret.arguments[0]
    };
  }
}

export class ConfigUserCommunicator extends MessageCommandCommunicator<ConfigUserProps> {
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

  public getProps(): ConfigUserProps {
    const interpret = withConvertParseCommandErrors.invoke(() =>
      interpretCommand(this.message.fragments, ConfigUserCommunicator.format, parameterTypes)
    );

    let enableMention: boolean | undefined = undefined;
    if (interpret.options.enableMention) {
      const keyWord = interpret.options.enableMention.toLowerCase();
      if (ConfigUserCommunicator.trueKeyWords.includes(keyWord)) enableMention = true;
      else if (ConfigUserCommunicator.falseKeyWords.includes(keyWord)) enableMention = false;
      else throw new InvalidFormatError("enableMention", "yes/on/true/no/off/false");
    }

    return {
      enableMention
    };
  }
}
