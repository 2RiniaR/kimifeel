import { ActionWith } from "../../base";
import { SessionIn } from "../../session";
import { SearchRequestsEndpoint, SearchRequestsEndpointParams, SearchRequestsEndpointResult } from "endpoints";
import { ErrorEmbed, RequestListEmbed } from "discord/views";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";

export class SlashCommandSearchRequestsAction extends ActionWith<SlashCommandEvent, SearchRequestsEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "request",
    subCommandName: "search",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new Session(context, this.endpoint).run();
  }
}

class Session extends SessionIn<SlashCommandSearchRequestsAction> {
  async fetch(): Promise<SearchRequestsEndpointParams> {
    await Promise.resolve();

    const genre = this.context.interaction.options.getString("genre", false);
    const order = this.context.interaction.options.getString("order", false);
    const page = this.context.interaction.options.getInteger("page", false);
    const content = this.context.interaction.options.getString("content", false);
    const applicant = this.context.interaction.options.getUser("applicant", false);
    const target = this.context.interaction.options.getUser("target", false);

    const defaultPage = 1;
    if (genre && genre !== "received" && genre !== "sent") {
      throw new Error();
    }

    if (order && order !== "latest" && order !== "oldest") {
      throw new Error();
    }

    return {
      clientDiscordId: this.context.member.id,
      status: (genre as "received" | "sent" | null) ?? "received",
      order: (order as "latest" | "oldest" | null) ?? "latest",
      page: page ?? defaultPage,
      content: content ?? undefined,
      applicantDiscordId: applicant?.id,
      targetDiscordId: target?.id
    };
  }

  async onSucceed(result: SearchRequestsEndpointResult) {
    const listEmbed = new RequestListEmbed({ requests: result });
    await this.context.interaction.reply({ embeds: [listEmbed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
