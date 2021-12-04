import { ErrorEmbed, ProfileDeletedEmbed } from "../views";
import { SlashCommandEvent, SlashCommandEventContext, SlashCommandEventOptions } from "../events";
import { SessionIn } from "../session";
import { DiscordFetchFailedActionError } from "../errors";
import { ActionWith } from "../action";
import { DeleteProfileEndpoint, DeleteProfileEndpointParams, DeleteProfileEndpointResult } from "../endpoints";

export class CommandDeleteProfileAction extends ActionWith<SlashCommandEvent, DeleteProfileEndpoint> {
  readonly options: SlashCommandEventOptions = {
    commandName: "delete-profile",
    allowBot: false
  };

  async onEvent(context: SlashCommandEventContext) {
    await new CommandDeleteProfileSession(context, this.endpoint).run();
  }
}

class CommandDeleteProfileSession extends SessionIn<CommandDeleteProfileAction> {
  index!: number;

  async fetch(): Promise<DeleteProfileEndpointParams> {
    await Promise.resolve();

    const index = this.context.interaction.options.getInteger("number");
    if (!index) throw new DiscordFetchFailedActionError();
    this.index = index;

    return {
      clientDiscordId: this.context.member.id,
      index: this.index
    };
  }

  async onSucceed(result: DeleteProfileEndpointResult) {
    const embed = new ProfileDeletedEmbed({
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
    const embed = new ErrorEmbed(error);
    await this.context.interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
