import { ErrorEmbed } from "../views/error-embed";
import { Action, ActionBaseParams, ContextOf, EventOf } from "~/discord/action";
import { Endpoint } from "~/discord/endpoint";
import { SlashCommandEvent, SlashCommandEventContext } from "~/discord/events/slash-command-event";

export type AddProfileParams = ActionBaseParams & {
  content: string;
};

export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}

export class AddProfileAction extends Action<SlashCommandEventContext, AddProfileParams> {
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

export class AddProfileEndpoint extends Endpoint<AddProfileAction> {
  protected defineEvent(): EventOf<AddProfileAction> {
    return new SlashCommandEvent("add-profile");
  }

  protected async onEvent(context: ContextOf<AddProfileAction>): Promise<void> {
    if (!this.listener) return;
    await new AddProfileAction(context, this.listener).run();
  }
}
