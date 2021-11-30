import { Action, ActionBaseParams } from "../action";
import { ErrorEmbed } from "../views";
import { SlashCommandEvent, SlashCommandEventContext } from "../events";
import { Session } from "../session";

export type AddProfileParams = ActionBaseParams & {
  content: string;
};

export class AddProfileAction extends Action<SlashCommandEventContext, AddProfileParams> {
  protected defineEvent() {
    return new SlashCommandEvent("add-profile");
  }

  protected async onEvent(context: SlashCommandEventContext) {
    if (!this.listener) return;
    await new AddProfileSession(context, this.listener).run();
  }
}

export class AddProfileSession extends Session<AddProfileAction> {
  content!: string;

  async fetchParams() {
    await Promise.resolve();

    const content = this.context.interaction.options.getString("content");
    if (!content) return;
    this.content = content;

    return {
      client: this.context.member.id,
      content: this.content
    };
  }

  async onSucceed() {
    await this.context.interaction.reply("登録されました。");
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed] });
  }
}
