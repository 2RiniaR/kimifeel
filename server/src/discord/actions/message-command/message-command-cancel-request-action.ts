import { SessionIn } from "../../session";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "../../events";
import { NoPermissionActionError, RequestNotFoundActionError } from "../../errors";
import { ErrorEmbed, RequestAcceptedEmbed } from "../../views";
import { ActionWith } from "../../action";
import { ChangeRequestEndpoint, ChangeRequestEndpointParams, ChangeRequestEndpointResult } from "../../endpoints";

export class SlashCommandCancelRequestAction extends ActionWith<SlashCommandEvent, ChangeRequestEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "cancel-request",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new SlashCommandChangeRequestSession(context, this.endpoint).run();
  }
}

class SlashCommandChangeRequestSession extends SessionIn<SlashCommandCancelRequestAction> {
  async fetch(): Promise<ChangeRequestEndpointParams> {
    await Promise.resolve();

    const index = this.context.interaction.options.getInteger("number");
    if (!index) throw new Error();

    const target = this.context.interaction.options.getUser("target");
    if (!target) throw new Error();

    return {
      clientDiscordId: this.context.member.id,
      index,
      targetDiscordId: target.id,
      controlType: "cancel"
    };
  }

  async onSucceed(result: ChangeRequestEndpointResult) {
    const embed = new RequestAcceptedEmbed({
      userName: this.context.member.displayName,
      userAvatarURL: this.context.member.displayAvatarURL(),
      profile: {
        authorUserId: result.authorDiscordId,
        index: result.index,
        content: result.content
      }
    });
    await this.context.interaction.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    if (error instanceof NoPermissionActionError) return;
    if (error instanceof RequestNotFoundActionError) return;
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed] });
  }
}
