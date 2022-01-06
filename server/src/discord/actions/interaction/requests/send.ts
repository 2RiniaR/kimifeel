import { GuildMember, Message } from "discord.js";
import { RequestEndpoint } from "../../../../endpoints/request";
import { CreateMessageCommandEventContext, CreateMessageCommandEventListener } from "../../../events/interaction";
import { ReactionAcceptRequestAction } from "../../reaction/requests/accept";
import { ReactionCancelRequestAction } from "../../reaction/requests/cancel";
import { ErrorEmbed, RequestSentEmbed } from "../../../views";
import { DiscordFetchFailedActionError, NoBotActionError } from "../../errors";
import { ReactionDenyRequestAction } from "../../reaction/requests/deny";

export class SendRequestAction implements CreateMessageCommandEventListener {
  private readonly endpoint: RequestEndpoint;

  constructor(endpoint: RequestEndpoint) {
    this.endpoint = endpoint;
  }

  async onMessageCommandCreated(context: CreateMessageCommandEventContext) {
    const target = context.interaction.options.getMember("target", true);
    const content = context.interaction.options.getString("content", true);

    if (!(target instanceof GuildMember)) {
      throw new DiscordFetchFailedActionError();
    }

    if (target.user.bot) {
      throw new NoBotActionError();
    }

    let request;
    try {
      request = await this.endpoint.create(context.member.id, {
        targetDiscordId: target.id,
        content: content
      });
    } catch (error) {
      const embed = new ErrorEmbed(error);
      await context.interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const embed = new RequestSentEmbed({
      index: request.index,
      requesterUserName: context.member.displayName,
      requesterUserAvatarURL: context.member.displayAvatarURL(),
      requesterUserId: context.member.id,
      content: content,
      targetUserName: target.displayName,
      targetUserId: target.id
    });

    const message = await context.interaction.reply({ embeds: [embed], fetchReply: true });
    if (!(message instanceof Message)) return;

    const emojiCharacters = [
      ...ReactionAcceptRequestAction.emojis,
      ...ReactionCancelRequestAction.emojis,
      ...ReactionDenyRequestAction.emojis
    ];
    await emojiCharacters.mapAsync((emoji) => message.react(emoji));
  }
}
