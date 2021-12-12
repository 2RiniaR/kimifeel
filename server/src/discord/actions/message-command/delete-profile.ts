import { ErrorEmbed, ProfileDeletedEmbed } from "discord/views";
import { MessageCommandEventContext, MessageCommandEvent } from "discord/events";
import { SessionIn } from "../session";
import { ActionWith } from "../base";
import { DeleteProfileEndpoint, DeleteProfileEndpointParams, DeleteProfileEndpointResult } from "endpoints";
import { basePhrase } from "./phrases";

const format = {
  prefixes: [`${basePhrase} delete-profile`, `${basePhrase} profile delete`],
  arguments: [
    {
      name: "プロフィールの番号",
      description: "",
      type: "integer"
    }
  ],
  options: {}
} as const;

export class MessageCommandDeleteProfileAction extends ActionWith<
  MessageCommandEvent<typeof format>,
  DeleteProfileEndpoint
> {
  readonly options = { format, allowBot: false };

  async onEvent(context: MessageCommandEventContext<typeof format>) {
    await new MessageCommandDeleteProfileSession(context, this.endpoint).run();
  }
}

class MessageCommandDeleteProfileSession extends SessionIn<MessageCommandDeleteProfileAction> {
  async fetch(): Promise<DeleteProfileEndpointParams> {
    await Promise.resolve();

    return {
      clientDiscordId: this.context.member.id,
      index: this.context.command.arguments[0]
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
