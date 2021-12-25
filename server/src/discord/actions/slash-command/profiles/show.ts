import { NoBotActionError } from "../../errors";
import { ActionWith } from "../../base";
import { SessionIn } from "../../session";
import { FindProfilesEndpoint, FindProfileEndpointParams, FindProfilesEndpointResult } from "endpoints";
import { ErrorEmbed, ProfileListEmbed } from "discord/views";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";

export class SlashCommandShowProfileAction extends ActionWith<SlashCommandEvent, FindProfilesEndpoint> {
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
  async fetch(): Promise<FindProfileEndpointParams> {
    await Promise.resolve();

    const owner = this.context.interaction.options.getUser("owner", false);
    const number = this.context.interaction.options.getInteger("number", true);

    if (owner && owner.bot) {
      throw new NoBotActionError();
    }

    return {
      clientDiscordId: this.context.member.id,
      ownerDiscordId: owner?.id ?? this.context.member.id,
      index: number
    };
  }

  async onSucceed(result: FindProfilesEndpointResult) {
    const listEmbed = new ProfileListEmbed({ profiles: [result] });
    await this.context.interaction.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
