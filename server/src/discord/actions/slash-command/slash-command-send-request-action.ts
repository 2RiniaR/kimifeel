import { GuildMember, Message } from "discord.js";
import { ErrorEmbed, RequestEmbed } from "../views";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "../events";
import { SessionIn } from "../session";
import { DiscordFetchFailedActionError, NoBotActionError } from "../errors";
import { ActionWith } from "../action";
import { CreateRequestEndpoint, CreateRequestEndpointParams, CreateRequestEndpointResult } from "../endpoints";
import { ReactionChangeRequestAction } from "./reaction-change-request-action";

export class CommandSendRequestAction extends ActionWith<SlashCommandEvent, CreateRequestEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "send-request",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new CommandSendRequestSession(context, this.endpoint).run();
  }
}

class CommandSendRequestSession extends SessionIn<CommandSendRequestAction> {
  private target!: GuildMember;
  private content!: string;

  protected async fetch(): Promise<CreateRequestEndpointParams> {
    await Promise.resolve();

    const target = this.context.interaction.options.getMember("target");
    if (!(target instanceof GuildMember)) {
      throw new DiscordFetchFailedActionError();
    }

    this.target = target;
    if (this.target.user.bot) {
      throw new NoBotActionError();
    }

    const content = this.context.interaction.options.getString("content");
    if (!content) {
      throw new DiscordFetchFailedActionError();
    }
    this.content = content;

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
