import { Action, ActionBaseParams } from "../action";
import { ErrorEmbed } from "../views";
import { SlashCommandEvent, SlashCommandEventContext } from "../events";
import { Session } from "../session";

export type DeleteProfileParams = ActionBaseParams & {
  index: number;
};

export class DeleteProfileAction extends Action<SlashCommandEventContext, DeleteProfileParams> {
  protected defineEvent() {
    return new SlashCommandEvent("delete-profile");
  }

  protected async onEvent(context: SlashCommandEventContext) {
    if (!this.listener) return;
    await new DeleteProfileSession(context, this.listener).run();
  }
}

export class DeleteProfileSession extends Session<DeleteProfileAction> {
  index!: number;

  async fetchParams() {
    await Promise.resolve();

    const index = this.context.interaction.options.getInteger("number");
    if (!index) return;
    this.index = index;

    return {
      client: this.context.member.id,
      index: this.index
    };
  }

  async onSucceed() {
    await this.context.interaction.reply("削除されました。");
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed] });
  }
}
