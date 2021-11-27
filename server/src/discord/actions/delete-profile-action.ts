import { ErrorEmbed } from "../views/error-embed";
import { Action, ActionBaseParams, ContextOf, EventOf } from "~/discord/action";
import { Endpoint } from "~/discord/endpoint";
import { SlashCommandEvent, SlashCommandEventContext } from "~/discord/events/slash-command-event";

export type DeleteProfileParams = ActionBaseParams & {
  index: number;
};

export class DeleteProfileAction extends Action<SlashCommandEventContext, DeleteProfileParams> {
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

export class DeleteProfileEndpoint extends Endpoint<DeleteProfileAction> {
  protected defineEvent(): EventOf<DeleteProfileAction> {
    return new SlashCommandEvent("delete-profile");
  }

  protected async onEvent(context: ContextOf<DeleteProfileAction>): Promise<void> {
    if (!this.listener) return;
    await new DeleteProfileAction(context, this.listener).run();
  }
}
