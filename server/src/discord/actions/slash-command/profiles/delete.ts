import { SessionIn } from "../../session";
import { ActionWith } from "../../base";
import { ErrorEmbed, ProfileDeletedEmbed } from "discord/views";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";
import { DeleteProfileEndpoint, DeleteProfileEndpointParams, DeleteProfileEndpointResult } from "endpoints";

export class SlashCommandDeleteProfileAction extends ActionWith<SlashCommandEvent, DeleteProfileEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "profile",
    subCommandName: "delete",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new Session(context, this.endpoint).run();
  }
}

class Session extends SessionIn<SlashCommandDeleteProfileAction> {
  async fetch(): Promise<DeleteProfileEndpointParams> {
    await Promise.resolve();

    const number = this.context.interaction.options.getInteger("number", true);

    return {
      clientDiscordId: this.context.member.id,
      index: number
    };
  }

  async onSucceed(result: DeleteProfileEndpointResult) {
    const embed = new ProfileDeletedEmbed({ profile: result });
    await this.context.interaction.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
