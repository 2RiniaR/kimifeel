import { ActionSessionIn } from "discord/actions/action-session";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";
import { NoPermissionActionError, RequestNotFoundEndpointError } from "discord/errors";
import { ErrorEmbed, RequestAcceptedEmbed } from "discord/views";
import { ActionWith } from "discord/action";
import {
  ChangeRequestControlType,
  ChangeRequestEndpoint,
  ChangeRequestEndpointParams,
  ChangeRequestEndpointResult
} from "endpoints";

export class SlashCommandReviewRequestAction extends ActionWith<SlashCommandEvent, ChangeRequestEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "review-request",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new SlashCommandChangeRequestSession(context, this.endpoint).run();
  }
}

class SlashCommandChangeRequestSession extends ActionSessionIn<SlashCommandReviewRequestAction> {
  async fetch(): Promise<ChangeRequestEndpointParams> {
    await Promise.resolve();
    const index = this.context.interaction.options.getInteger("number", true);
    const review = this.context.interaction.options.getString("review", true);
    if (!(review in ["accept", "deny"])) throw new Error();

    return {
      clientDiscordId: this.context.member.id,
      index,
      targetDiscordId: this.context.member.id,
      controlType: review as ChangeRequestControlType
    };
  }

  async onSucceed(result: ChangeRequestEndpointResult) {
    const embed = new RequestAcceptedEmbed({
      userName: this.context.member.displayName,
      userAvatarURL: this.context.member.displayAvatarURL(),
      profile: {
        authorUserId: result.authorDiscordId,
        index: result.index,
        content: result.content
      }
    });
    await this.context.interaction.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionActionError) return;
    if (error instanceof RequestNotFoundEndpointError) return;
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed] });
  }
}
