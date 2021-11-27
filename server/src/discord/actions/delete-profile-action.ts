import { ErrorEmbed } from "../views/error-embed";
import { Session, ActionBaseParams, ContextOf, EventOf } from "~/discord/session";
import { Action } from "~/discord/action";
import { SlashCommandEvent, SlashCommandEventContext } from "~/discord/events/slash-command-event";

export type DeleteProfileParams = ActionBaseParams & {
  index: number;
};

export class DeleteProfileSession extends Session<SlashCommandEventContext, DeleteProfileParams> {
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
    const embed = new ErrorEmbed({ type: "error", error });
    await this.context.interaction.reply({ embeds: [embed] });
  }
}

export class DeleteProfileAction extends Action<DeleteProfileSession> {
  protected defineEvent(): EventOf<DeleteProfileSession> {
    return new SlashCommandEvent("delete-profile");
  }

  protected async onEvent(context: ContextOf<DeleteProfileSession>): Promise<void> {
    if (!this.listener) return;
    await new DeleteProfileSession(context, this.listener).run();
  }
}
