import { GuildMember } from "discord.js";
import { ErrorEmbed } from "../views/error-embed";
import { SlashCommandEvent, SlashCommandEventContext } from "~/discord/events/slash-command-event";
import { RequestEmbed } from "~/discord/views/request-embed";
import { Action, ActionBaseParams } from "~/discord/action";
import { Session } from "~/discord/session";

export type SubmitRequestParams = ActionBaseParams & {
  target: string;
  content: string;
};

export type SubmitRequestResult = {
  index: number;
};

export class SubmitRequestAction extends Action<SlashCommandEventContext, SubmitRequestParams, SubmitRequestResult> {
  protected defineEvent() {
    return new SlashCommandEvent("request-profile");
  }

  protected async onEvent(context: SlashCommandEventContext) {
    if (!this.listener) return;
    await new SubmitRequestSession(context, this.listener).run();
  }
}

export class SubmitRequestSession extends Session<SubmitRequestAction> {
  private target!: GuildMember;
  private content!: string;

  protected async fetchParams() {
    await Promise.resolve();

    const target = this.context.interaction.options.getMember("target");
    if (!(target instanceof GuildMember)) return;
    this.target = target;

    const content = this.context.interaction.options.getString("content");
    if (!content) return;
    this.content = content;

    return {
      client: this.context.member.id,
      target: this.target.id,
      content: this.content
    };
  }

  protected async onFailed(error: unknown): Promise<void> {
    const embed = new ErrorEmbed({ type: "error", error });
    await this.context.interaction.reply({ embeds: [embed] });
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
    const message = await this.context.interaction.channel?.send({ embeds: [embed] });
    if (!message) return;

    await message.react("✅❌⛔");
  }
}
