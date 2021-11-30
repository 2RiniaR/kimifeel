import { Action, ActionBaseParams } from "../action";
import { ErrorEmbed, ProfileDeletedEmbed } from "../views";
import { SlashCommandEvent, SlashCommandEventContext } from "../events";
import { Session } from "../session";
import { DiscordFetchFailedActionError } from "../errors";

export type DeleteProfileParams = ActionBaseParams & {
  index: number;
};

export type DeleteProfileResult = {
  index: number;
  content: string;
  authorUserId: string;
};

export class DeleteProfileAction extends Action<SlashCommandEventContext, DeleteProfileParams, DeleteProfileResult> {
  protected defineEvent() {
    return new SlashCommandEvent("delete-profile", undefined, { allowBot: false });
  }

  protected async onEvent(context: SlashCommandEventContext) {
    if (!this.listener) return;
    await new DeleteProfileSession(context, this.listener).run();
  }
}

export class DeleteProfileSession extends Session<DeleteProfileAction> {
  index!: number;

  async fetch(): Promise<DeleteProfileParams> {
    await Promise.resolve();

    const index = this.context.interaction.options.getInteger("number");
    if (!index) throw new DiscordFetchFailedActionError();
    this.index = index;

    return {
      client: this.context.member.id,
      index: this.index
    };
  }

  async onSucceed() {
    const embed = new ProfileDeletedEmbed({
      userName: this.context.member.displayName,
      userAvatarURL: this.context.member.displayAvatarURL(),
      profile: {
        authorUserId: this.result.authorUserId,
        index: this.result.index,
        content: this.result.content
      }
    });
    await this.context.interaction.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
