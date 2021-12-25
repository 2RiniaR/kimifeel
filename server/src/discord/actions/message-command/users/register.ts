import { ActionWith } from "../../base";
import { RegisterUserEndpoint, RegisterUserEndpointParams, RegisterUserEndpointResult } from "endpoints";
import { ErrorEmbed } from "discord/views";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { basePhrase } from "../phrases";
import { MessageCommandSession } from "../session";
import { NoBotActionError } from "../../errors";
import { UserRegisteredEmbed } from "../../../views/user-registered-embed";

const format = {
  prefixes: [`${basePhrase} user register`],
  arguments: [],
  options: {}
} as const;

export class MessageCommandRegisterUserAction extends ActionWith<MessageCommandEvent, RegisterUserEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: MessageCommandEventContext) {
    await new Session(context, this.endpoint, format).run();
  }
}

class Session extends MessageCommandSession<MessageCommandRegisterUserAction, typeof format> {
  async fetch(): Promise<RegisterUserEndpointParams> {
    await Promise.resolve();

    if (this.context.member.user.bot) {
      throw new NoBotActionError();
    }

    return {
      clientDiscordId: this.context.member.id
    };
  }

  async onSucceed(result: RegisterUserEndpointResult) {
    const embed = new UserRegisteredEmbed({ discordId: result.discordId });
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
