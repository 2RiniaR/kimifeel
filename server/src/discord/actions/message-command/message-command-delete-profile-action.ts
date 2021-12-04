import { ErrorEmbed, ProfileDeletedEmbed } from "discord/views";
import { MessageCommandEventContext, MessageCommandEvent, MessageCommandEventOptions } from "discord/events";
import { ActionSessionIn } from "discord/actions/action-session";
import { ActionWith } from "discord/action";
import { DeleteProfileEndpoint, DeleteProfileEndpointParams, DeleteProfileEndpointResult } from "endpoints";
import { basePhrase } from "./phrases";

export class MessageCommandDeleteProfileAction extends ActionWith<MessageCommandEvent, DeleteProfileEndpoint> {
  readonly options: MessageCommandEventOptions = {
    prefixes: [`${basePhrase} delete-profile`, `${basePhrase} profile delete`],
    allowBot: false
  };

  async onEvent(context: MessageCommandEventContext) {
    await new MessageCommandDeleteProfileSession(context, this.endpoint).run();
  }
}

class MessageCommandDeleteProfileSession extends ActionSessionIn<MessageCommandDeleteProfileAction> {
  async fetch(): Promise<DeleteProfileEndpointParams> {
    await Promise.resolve();
    if (this.context.arguments.length < 1) throw new Error();
    const index = parseInt(this.context.arguments[0]);

    return {
      clientDiscordId: this.context.member.id,
      index
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
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
