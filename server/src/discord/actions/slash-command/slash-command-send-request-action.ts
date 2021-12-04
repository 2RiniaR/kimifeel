import { GuildMember, Message } from "discord.js";
import { ErrorEmbed, RequestEmbed } from "discord/views";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "discord/events";
import { ActionSessionIn } from "discord/actions/action-session";
import { DiscordFetchFailedActionError, NoBotActionError } from "discord/errors";
import { ActionWith } from "discord/action";
import { CreateRequestEndpoint, CreateRequestEndpointParams, CreateRequestEndpointResult } from "endpoints";
import { ReactionChangeRequestAction } from "../reaction/reaction-change-request-action";

export class SlashCommandSendRequestAction extends ActionWith<SlashCommandEvent, CreateRequestEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "send-request",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new SlashCommandSendRequestSession(context, this.endpoint).run();
  }
}

class SlashCommandSendRequestSession extends ActionSessionIn<SlashCommandSendRequestAction> {
  private target!: GuildMember;
  private content!: string;

  protected async fetch(): Promise<CreateRequestEndpointParams> {
    await Promise.resolve();

    const target = this.context.interaction.options.getMember("target", true);
    if (!(target instanceof GuildMember)) {
      throw new DiscordFetchFailedActionError();
    }

    this.target = target;
    if (this.target.user.bot) {
      throw new NoBotActionError();
    }

    this.content = this.context.interaction.options.getString("content", true);

    return {
      clientDiscordId: this.context.member.id,
      targetDiscordId: this.target.id,
      content: this.content
    };
  }

  protected async onSucceed(result: CreateRequestEndpointResult) {
    const embed = new RequestEmbed({
      index: result.index,
      requesterUserName: this.context.member.displayName,
      requesterUserAvatarURL: this.context.member.displayAvatarURL(),
      requesterUserId: this.context.member.id,
      content: this.content,
      targetUserName: this.target.displayName,
      targetUserId: this.target.id
    });

    const message = await this.context.interaction.reply({ embeds: [embed], fetchReply: true });
    if (!(message instanceof Message)) return;

    const emojiCharacters = Object.keys(ReactionChangeRequestAction.emojiToChange);
    await emojiCharacters.mapAsync((emoji) => message.react(emoji));
  }

  protected async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
