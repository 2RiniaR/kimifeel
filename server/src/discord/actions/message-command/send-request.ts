import { GuildMember } from "discord.js";
import { SessionIn } from "../session";
import { ActionWith } from "../base";
import { ErrorEmbed, RequestSentEmbed } from "discord/views";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { DiscordFetchFailedActionError, NoBotActionError } from "discord/actions/errors";
import { CreateRequestEndpoint, CreateRequestEndpointParams, CreateRequestEndpointResult } from "endpoints";
import { targetGuildManager } from "discord";
import { basePhrase } from "./phrases";
import { ReactionAcceptRequestAction } from "../reaction/accept-request";
import { ReactionCancelRequestAction } from "../reaction/cancel-request";
import { ReactionDenyRequestAction } from "../reaction/deny-request";

const format = {
  prefixes: [`${basePhrase} send-request`, `${basePhrase} request send`],
  arguments: [
    {
      name: "送信先ユーザーのID",
      description: "",
      type: "string"
    },
    {
      name: "内容",
      description: "",
      type: "string"
    }
  ],
  options: {}
} as const;

export class MessageCommandSendRequestAction extends ActionWith<
  MessageCommandEvent<typeof format>,
  CreateRequestEndpoint
> {
  readonly options = { format, allowBot: false };

  async onEvent(context: MessageCommandEventContext<typeof format>) {
    await new MessageCommandSendRequestSession(context, this.endpoint).run();
  }
}

class MessageCommandSendRequestSession extends SessionIn<MessageCommandSendRequestAction> {
  private target!: GuildMember;
  private content!: string;

  protected async fetch(): Promise<CreateRequestEndpointParams> {
    const targetId = this.context.command.arguments[0];
    const target = await targetGuildManager.getMember(targetId);
    if (!target) {
      throw new DiscordFetchFailedActionError();
    }

    this.target = target;
    if (this.target.user.bot) {
      throw new NoBotActionError();
    }

    this.content = this.context.command.arguments[1];

    return {
      clientDiscordId: this.context.member.id,
      targetDiscordId: this.target.id,
      content: this.content
    };
  }

  protected async onSucceed(result: CreateRequestEndpointResult) {
    const embed = new RequestSentEmbed({
      index: result.index,
      requesterUserName: this.context.member.displayName,
      requesterUserAvatarURL: this.context.member.displayAvatarURL(),
      requesterUserId: this.context.member.id,
      content: this.content,
      targetUserName: this.target.displayName,
      targetUserId: this.target.id
    });

    const message = await this.context.message.reply({ embeds: [embed] });

    const emojiCharacters = [
      ...ReactionAcceptRequestAction.emojis,
      ...ReactionCancelRequestAction.emojis,
      ...ReactionDenyRequestAction.emojis
    ];
    await emojiCharacters.mapAsync((emoji) => message.react(emoji));
  }

  protected async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
