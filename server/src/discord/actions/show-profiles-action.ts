import { GuildMember } from "discord.js";
import { ProfileListElement, ProfileListEmbed } from "../views/profile-list-embed";
import { ErrorEmbed } from "../views/error-embed";
import { SlashCommandEvent, SlashCommandEventContext } from "~/discord/events/slash-command-event";
import { Action, ActionBaseParams } from "~/discord/action";
import { Session } from "~/discord/session";

export type ShowProfilesParams = ActionBaseParams & {
  target: string;
};

export type ShowProfilesResult = ProfileListElement[];

export class ShowProfilesAction extends Action<SlashCommandEventContext, ShowProfilesParams, ShowProfilesResult> {
  protected defineEvent() {
    return new SlashCommandEvent("show-profile");
  }

  protected async onEvent(context: SlashCommandEventContext) {
    if (!this.listener) return;
    await new ShowProfilesSession(context, this.listener).run();
  }
}

export class ShowProfilesSession extends Session<ShowProfilesAction> {
  private target!: GuildMember;

  async fetchParams() {
    await Promise.resolve();

    const target = this.context.interaction.options.getMember("target");
    if (!(target instanceof GuildMember)) return;
    this.target = target;

    return {
      client: this.context.member.id,
      target: this.target.id
    };
  }

  async onFailed(error: unknown): Promise<void> {
    const embed = new ErrorEmbed({ type: "error", error });
    await this.context.interaction.reply({ embeds: [embed] });
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
