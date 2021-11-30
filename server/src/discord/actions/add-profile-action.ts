import { Action, ActionBaseParams } from "../action";
import { ErrorEmbed, ProfileAddedEmbed } from "../views";
import { SlashCommandEvent, SlashCommandEventContext } from "../events";
import { Session } from "../session";
import { DiscordFetchFailedActionError } from "../errors";

export type AddProfileParams = ActionBaseParams & {
  content: string;
};

export type AddProfileResult = {
  index: number;
  content: string;
  authorUserId: string;
};

export class AddProfileAction extends Action<SlashCommandEventContext, AddProfileParams, AddProfileResult> {
  protected defineEvent() {
    return new SlashCommandEvent("add-profile", undefined, { allowBot: false });
  }

  protected async onEvent(context: SlashCommandEventContext) {
    if (!this.listener) return;
    await new AddProfileSession(context, this.listener).run();
  }
}

export class AddProfileSession extends Session<AddProfileAction> {
  content!: string;

  async fetch(): Promise<AddProfileParams> {
    await Promise.resolve();

    const content = this.context.interaction.options.getString("content");
    if (!content) throw new DiscordFetchFailedActionError();
    this.content = content;

    return {
      client: this.context.member.id,
      content: this.content
    };
  }

  async onSucceed() {
    const embed = new ProfileAddedEmbed({
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
