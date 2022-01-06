import { ActionWith } from "../../base";
import { SessionIn } from "../../session";
import { FindProfileEndpoint, EndpointParams, EndpointResult } from "endpoints";
import { ErrorEmbed, ProfileListEmbed } from "discord/views";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";

export class SlashCommandShowProfileAction extends ActionWith<SlashCommandEvent, FindProfileEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "profile",
    subCommandName: "show",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new Session(context, this.endpoint).run();
  }
}

class Session extends SessionIn<SlashCommandShowProfileAction> {
  async fetch(): Promise<EndpointParams> {
    await Promise.resolve();

    const number = this.context.interaction.options.getInteger("number", true);

    return {
      clientDiscordId: this.context.member.id,
      index: number
    };
  }

  async onSucceed(result: EndpointResult) {
    const listEmbed = new ProfileListEmbed({ profiles: [result] });
    await this.context.interaction.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
