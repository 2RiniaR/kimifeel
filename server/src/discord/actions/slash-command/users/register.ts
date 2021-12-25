import { SessionIn } from "../../session";
import { ActionWith } from "../../base";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";
import { ErrorEmbed } from "discord/views";
import { RegisterUserEndpoint, RegisterUserEndpointParams, RegisterUserEndpointResult } from "endpoints";
import { UserRegisteredEmbed } from "../../../views/user-registered-embed";
import { NoBotActionError } from "../../errors";

export class SlashCommandRegisterUserAction extends ActionWith<SlashCommandEvent, RegisterUserEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "request",
    subCommandName: "cancel",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new Session(context, this.endpoint).run();
  }
}

class Session extends SessionIn<SlashCommandRegisterUserAction> {
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
    await this.context.interaction.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionEndpointError) return;
    if (error instanceof RequestNotFoundEndpointError) return;
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed] });
  }
}
