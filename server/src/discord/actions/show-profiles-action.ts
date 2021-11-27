import { GuildMember } from "discord.js";
import { ProfileListElement, ProfileListEmbed } from "../views/profile-list-embed";
import { ErrorEmbed } from "../views/error-embed";
import { Session, ActionBaseParams, ContextOf, EventOf } from "~/discord/session";
import { SlashCommandEvent, SlashCommandEventContext } from "~/discord/events/slash-command-event";
import { Action } from "~/discord/action";

export type ShowProfilesParams = ActionBaseParams & {
  target: string;
};

export type ShowProfilesResult = ProfileListElement[];

export class ShowProfilesSession extends Session<SlashCommandEventContext, ShowProfilesParams, ShowProfilesResult> {
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

export class ShowProfilesAction extends Action<ShowProfilesSession> {
  protected defineEvent(): EventOf<ShowProfilesSession> {
    return new SlashCommandEvent("show-profile");
  }

  protected async onEvent(context: ContextOf<ShowProfilesSession>): Promise<void> {
    if (!this.listener) return;
    await new ShowProfilesSession(context, this.listener).run();
  }
}
