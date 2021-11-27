import { ErrorEmbed } from "../views/error-embed";
import { Action, ActionBaseParams } from "~/discord/action";
import { SlashCommandEvent, SlashCommandEventContext } from "~/discord/events/slash-command-event";
import { Session } from "~/discord/session";

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
    const embed = new ErrorEmbed({ type: "error", error });
    await this.context.interaction.reply({ embeds: [embed] });
  }
}
