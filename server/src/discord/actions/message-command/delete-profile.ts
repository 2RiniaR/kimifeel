import { ErrorEmbed, ProfileDeletedEmbed } from "discord/views";
import { MessageCommandEventContext, MessageCommandEvent } from "discord/events";
import { ActionWith } from "../base";
import { DeleteProfileEndpoint, DeleteProfileEndpointParams, DeleteProfileEndpointResult } from "endpoints";
import { basePhrase } from "./phrases";
import { MessageCommandSession } from "./session";

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

export class MessageCommandDeleteProfileAction extends ActionWith<MessageCommandEvent, DeleteProfileEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: MessageCommandEventContext) {
    await new MessageCommandDeleteProfileSession(context, this.endpoint, format).run();
  }
}

class MessageCommandDeleteProfileSession extends MessageCommandSession<
  MessageCommandDeleteProfileAction,
  typeof format
> {
  async fetch(): Promise<DeleteProfileEndpointParams> {
    await Promise.resolve();

    return {
      clientDiscordId: this.context.member.id,
      index: this.command.arguments[0]
    };
  }

  async onSucceed(result: DeleteProfileEndpointResult) {
    const embed = new ProfileDeletedEmbed({ profile: result });
    await this.context.message.reply({ embeds: [embed] });
  }

  async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
