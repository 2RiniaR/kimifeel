import { GuildMember, Message } from "discord.js";
import { Endpoint, EndpointParamsBase } from "../endpoint";
import { ErrorEmbed, RequestEmbed } from "../views";
import { SlashCommandEvent, SlashCommandEventContext } from "../events";
import { Session } from "../session";
import { DiscordFetchFailedActionError, NoBotActionError } from "../errors";

export type SubmitRequestParams = EndpointParamsBase & {
  target: string;
  content: string;
};

export type SubmitRequestResult = {
  index: number;
};

export class SubmitRequestAction extends Endpoint<SlashCommandEventContext, SubmitRequestParams, SubmitRequestResult> {
  protected defineEvent() {
    return new SlashCommandEvent("request-profile", undefined, { allowBot: false });
  }

  protected async onEvent(context: SlashCommandEventContext) {
    if (!this.listener) return;
    await new SubmitRequestSession(context, this.listener).run();
  }
}

export class SubmitRequestSession extends Session<SubmitRequestAction> {
  private target!: GuildMember;
  private content!: string;

  protected async fetch(): Promise<SubmitRequestParams> {
    await Promise.resolve();

    const target = this.context.interaction.options.getMember("target");
    if (!(target instanceof GuildMember)) throw new DiscordFetchFailedActionError();
    this.target = target;
    if (this.target.user.bot) throw new NoBotActionError();

    const content = this.context.interaction.options.getString("content");
    if (!content) throw new DiscordFetchFailedActionError();
    this.content = content;

    return {
      clientDiscordId: this.context.member.id,
      target: this.target.id,
      content: this.content
    };
  }

  protected async onFailed(error: unknown): Promise<void> {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }

  protected async onSucceed(): Promise<void> {
    const embed = new RequestEmbed({
      index: this.result.index,
      requesterUserName: this.context.member.displayName,
      requesterUserAvatarURL: this.context.member.displayAvatarURL(),
      requesterUserId: this.context.member.id,
      content: this.content,
      targetUserName: this.target.displayName,
      targetUserId: this.target.id
    });
    const message = await this.context.interaction.reply({ embeds: [embed], fetchReply: true });
    if (!(message instanceof Message)) return;
    await ["✅", "❌", "⛔"].mapAsync((emoji) => message.react(emoji));
  }
}
