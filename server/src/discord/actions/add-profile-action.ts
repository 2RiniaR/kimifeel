import { ErrorEmbed } from "../views/error-embed";
import { Session, ActionBaseParams, ContextOf, EventOf } from "~/discord/session";
import { Action } from "~/discord/action";
import { SlashCommandEvent, SlashCommandEventContext } from "~/discord/events/slash-command-event";

export type AddProfileParams = ActionBaseParams & {
  content: string;
};

export class AddProfileSession extends Session<SlashCommandEventContext, AddProfileParams> {
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

export class AddProfileAction extends Action<AddProfileSession> {
  protected defineEvent(): EventOf<AddProfileSession> {
    return new SlashCommandEvent("add-profile");
  }

  protected async onEvent(context: ContextOf<AddProfileSession>): Promise<void> {
    if (!this.listener) return;
    await new AddProfileSession(context, this.listener).run();
  }
}
