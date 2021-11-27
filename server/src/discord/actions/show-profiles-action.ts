import { GuildMember } from "discord.js";
import { ProfileListElement, ProfileListEmbed } from "../views/profile-list-embed";
import { ErrorEmbed } from "../views/error-embed";
import { Action, ActionBaseParams, ContextOf, EventOf } from "~/discord/action";
import { SlashCommandEvent, SlashCommandEventContext } from "~/discord/events/slash-command-event";
import { Endpoint } from "~/discord/endpoint";

export type ShowProfilesParams = ActionBaseParams & {
  target: string;
};

export type ShowProfilesResult = ProfileListElement[];

export class ShowProfilesAction extends Action<SlashCommandEventContext, ShowProfilesParams, ShowProfilesResult> {
  private target!: GuildMember;

  async fetchParams() {
    await Promise.resolve();

    const target = this.context.interaction.options.getMember("member");
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

export class ShowProfilesEndpoint extends Endpoint<ShowProfilesAction> {
  protected defineEvent(): EventOf<ShowProfilesAction> {
    return new SlashCommandEvent("show-profile");
  }

  protected async onEvent(context: ContextOf<ShowProfilesAction>): Promise<void> {
    if (!this.listener) return;
    await new ShowProfilesAction(context, this.listener).run();
  }
}
