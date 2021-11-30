import { GuildMember } from "discord.js";
import { Action, ActionBaseParams } from "../action";
import { ErrorEmbed, ProfileListEmbed, ProfileMarkdownProps } from "../views";
import { SlashCommandEvent, SlashCommandEventContext } from "../events";
import { Session } from "../session";
import { DiscordFetchFailedActionError, NoBotActionError } from "../errors";

export type ShowProfilesParams = ActionBaseParams & {
  target: string;
};

export type ShowProfilesResult = ProfileMarkdownProps[];

export class ShowProfilesAction extends Action<SlashCommandEventContext, ShowProfilesParams, ShowProfilesResult> {
  protected defineEvent() {
    return new SlashCommandEvent("show-profile", undefined, { allowBot: false });
  }

  protected async onEvent(context: SlashCommandEventContext) {
    if (!this.listener) return;
    await new ShowProfilesSession(context, this.listener).run();
  }
}

export class ShowProfilesSession extends Session<ShowProfilesAction> {
  private target!: GuildMember;

  async fetch(): Promise<ShowProfilesParams> {
    await Promise.resolve();

    const target = this.context.interaction.options.getMember("target");
    if (!(target instanceof GuildMember)) throw new DiscordFetchFailedActionError();
    this.target = target;
    if (this.target.user.bot) throw new NoBotActionError();

    return {
      client: this.context.member.id,
      target: this.target.id
    };
  }

  async onFailed(error: unknown): Promise<void> {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }

  async onSucceed(): Promise<void> {
    const listEmbed = new ProfileListEmbed({
      elements: this.result,
      targetName: this.target.displayName,
      targetAvatarURL: this.target.displayAvatarURL()
    });
    await this.context.interaction.reply({ embeds: [listEmbed] });
  }
}
