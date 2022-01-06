import { ActionWith } from "../../base";
import { SessionIn } from "../../session";
import { FindRequestEndpoint, EndpointParams, EndpointResult } from "endpoints";
import { ErrorEmbed, RequestListEmbed } from "discord/views";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";

export class SlashCommandShowRequestAction extends ActionWith<SlashCommandEvent, FindRequestEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "request",
    subCommandName: "show",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new Session(context, this.endpoint).run();
  }
}

class Session extends SessionIn<SlashCommandShowRequestAction> {
  async fetch(): Promise<EndpointParams> {
    await Promise.resolve();

    const index = this.context.interaction.options.getInteger("number", true);

    return {
      clientDiscordId: this.context.member.id,
      index: index
    };
  }

  async onSucceed(result: EndpointResult) {
    const listEmbed = new RequestListEmbed({ requests: [result] });
    await this.context.interaction.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
