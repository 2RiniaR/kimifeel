import { MessageCommandCommunicator } from "./base";
import { ConfigUserProps, ShowUserStatsProps } from "../../actions";
import { InvalidFormatError } from "../../structures";
import { tryGetValue } from "helpers/object";

export class RegisterUserCommunicator extends MessageCommandCommunicator {
  public getProps() {
    this.checkArgsCount(0);
    this.checkOptionsKey([]);
  }
}

export class ShowUserStatsCommunicator extends MessageCommandCommunicator<ShowUserStatsProps> {
  public getProps(): ShowUserStatsProps {
    this.checkArgsCount(1);
    this.checkOptionsKey([]);

    return {
      userId: this.command.fragments.arguments[0]
    };
  }
}

export class ConfigUserCommunicator extends MessageCommandCommunicator<ConfigUserProps> {
  private static readonly trueKeyWords = ["yes", "on", "true"];
  private static readonly falseKeyWords = ["no", "off", "false"];

  public getProps(): ConfigUserProps {
    this.checkArgsCount(0);
    this.checkOptionsKey(["enableMention"]);

    const options = this.command.fragments.options;
    const enableMentionRaw = tryGetValue(options, "enableMention");
    let enableMention: boolean | undefined = undefined;
    if (enableMentionRaw !== undefined) {
      const keyWord = enableMentionRaw.toLowerCase();
      if (ConfigUserCommunicator.trueKeyWords.includes(keyWord)) enableMention = true;
      else if (ConfigUserCommunicator.falseKeyWords.includes(keyWord)) enableMention = false;
      else throw new InvalidFormatError("enableMention", "yes/on/true/no/off/false");
    }

    return {
      enableMention
    };
  }
}
