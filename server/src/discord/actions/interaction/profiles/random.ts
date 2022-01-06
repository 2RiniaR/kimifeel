import { NoBotActionError } from "../../errors";
import { ActionWith } from "../../base";
import { SessionIn } from "../../session";
import { RandomProfilesEndpoint, EndpointParams, EndpointResult } from "endpoints";
import { ErrorEmbed, ProfileListEmbed } from "discord/views";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";

export class SlashCommandRandomProfilesAction extends ActionWith<SlashCommandEvent, RandomProfilesEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "profile",
    subCommandName: "random",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new Session(context, this.endpoint).run();
  }
}

class Session extends SessionIn<SlashCommandRandomProfilesAction> {
  async fetch(): Promise<EndpointParams> {
    await Promise.resolve();

    const owner = this.context.interaction.options.getUser("owner", false);
    const author = this.context.interaction.options.getUser("author", false);
    const content = this.context.interaction.options.getString("content", false);

    if ((owner && owner.bot) || (author && author.bot)) {
      throw new NoBotActionError();
    }

    return {
      clientDiscordId: this.context.member.id,
      ownerDiscordId: owner?.id,
      authorDiscordId: author?.id,
      content: content ?? undefined
    };
  }

  async onSucceed(result: EndpointResult) {
    const listEmbed = new ProfileListEmbed({ profiles: result });
    await this.context.interaction.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
