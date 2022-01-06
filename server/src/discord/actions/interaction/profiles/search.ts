import { NoBotActionError } from "../../errors";
import { ActionWith } from "../../base";
import { SessionIn } from "../../session";
import { SearchProfilesEndpoint, EndpointParams, EndpointResult } from "endpoints";
import { ErrorEmbed, ProfileListEmbed } from "discord/views";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";

export class SlashCommandSearchProfilesAction extends ActionWith<SlashCommandEvent, SearchProfilesEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "profile",
    subCommandName: "search",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new Session(context, this.endpoint).run();
  }
}

class Session extends SessionIn<SlashCommandSearchProfilesAction> {
  async fetch(): Promise<EndpointParams> {
    await Promise.resolve();

    const order = this.context.interaction.options.getString("order", false);
    const owner = this.context.interaction.options.getUser("owner", false);
    const author = this.context.interaction.options.getUser("author", false);
    const page = this.context.interaction.options.getInteger("page", false);
    const content = this.context.interaction.options.getString("content", false);

    if (order && order !== "latest" && order !== "oldest") {
      throw new Error();
    }

    const defaultPage = 1;
    if ((owner && owner.bot) || (author && author.bot)) {
      throw new NoBotActionError();
    }

    return {
      clientDiscordId: this.context.member.id,
      order: (order as "latest" | "oldest" | null) ?? "latest",
      ownerDiscordId: owner?.id,
      authorDiscordId: author?.id,
      page: page ?? defaultPage,
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
