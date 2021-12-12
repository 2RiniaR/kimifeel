import { ActionSessionIn } from "discord/actions/action-session";
import { ReactionAddEvent, ReactionAddEventContext, ReactionAddEventOptions } from "discord/events";
import { DiscordFetchFailedActionError, NoPermissionActionError, RequestNotFoundEndpointError } from "discord/actions/errors";
import { RequestEmbed, ErrorEmbed, RequestAcceptedEmbed } from "discord/views";
import { ActionWith } from "discord/actions/action";
import {
  ChangeRequestControlType,
  ChangeRequestEndpoint,
  ChangeRequestEndpointParams,
  ChangeRequestEndpointResult
} from "endpoints";

export class ReactionChangeRequestAction extends ActionWith<ReactionAddEvent, ChangeRequestEndpoint> {
  public static emojiToChange: { [emoji: string]: ChangeRequestControlType } = {
    "✅": "accept",
    "❌": "deny",
    "⛔": "cancel"
  };

  readonly options: ReactionAddEventOptions = {
    emojis: Object.keys(ReactionChangeRequestAction.emojiToChange),
    allowBot: false,
    myMessageOnly: true
  };

  onEvent(context: ReactionAddEventContext): Promise<void> {
    return new ReactionChangeRequestSession(context, this.endpoint).run();
  }
}

class ReactionChangeRequestSession extends ActionSessionIn<ReactionChangeRequestAction> {
  async fetch(): Promise<ChangeRequestEndpointParams> {
    await Promise.resolve();

    if (this.context.message.embeds.length === 0) {
      throw new DiscordFetchFailedActionError();
    }
    const requestEmbed = this.context.message.embeds[0];
    const index = RequestEmbed.getIndex(requestEmbed);
    const targetDiscordId = RequestEmbed.getUserId(requestEmbed);
    if (!index || !targetDiscordId) {
      throw new DiscordFetchFailedActionError();
    }

    const emojiCharacter = this.context.reaction.emoji.toString();
    if (emojiCharacter in ReactionChangeRequestAction.emojiToChange) {
      throw new Error("Unexpected emoji was come.");
    }

    return {
      clientDiscordId: this.context.member.id,
      index,
      targetDiscordId,
      controlType: ReactionChangeRequestAction.emojiToChange[emojiCharacter]
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
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionActionError) return;
    if (error instanceof RequestNotFoundEndpointError) return;
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
