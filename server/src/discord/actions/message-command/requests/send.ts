import { GuildMember } from "discord.js";
import { ActionWith } from "../../base";
import { ErrorEmbed, RequestSentEmbed } from "discord/views";
import { MessageCommandEvent, MessageCommandEventContext } from "discord/events";
import { DiscordFetchFailedActionError, NoBotActionError } from "discord/actions/errors";
import { CreateRequestEndpoint, CreateRequestEndpointParams, CreateRequestEndpointResult } from "endpoints";
import { targetGuildManager } from "discord/index";
import { basePhrase } from "../phrases";
import { ReactionAcceptRequestAction } from "../../reaction/requests/accept";
import { ReactionCancelRequestAction } from "../../reaction/requests/cancel";
import { ReactionDenyRequestAction } from "../../reaction/requests/deny";
import { MessageCommandSession } from "../session";

const format = {
  prefixes: [`${basePhrase} send-request`, `${basePhrase} request send`],
  arguments: [
    {
      name: "送信先ユーザーのID",
      description: "",
      type: "userId"
    },
    {
      name: "内容",
      description: "",
      type: "string"
    }
  ],
  options: {}
} as const;

export class MessageCommandSendRequestAction extends ActionWith<MessageCommandEvent, CreateRequestEndpoint> {
  readonly options = { prefixes: format.prefixes, allowBot: false };

  async onEvent(context: MessageCommandEventContext) {
    await new Session(context, this.endpoint, format).run();
  }
}

class Session extends MessageCommandSession<MessageCommandSendRequestAction, typeof format> {
  private target!: GuildMember;
  private content!: string;

  protected async fetch(): Promise<CreateRequestEndpointParams> {
    const targetId = this.command.arguments[0];
    const target = await targetGuildManager.getMember(targetId);
    if (!target) {
      throw new DiscordFetchFailedActionError();
    }

    this.target = target;
    if (this.target.user.bot) {
      throw new NoBotActionError();
    }

    this.content = this.command.arguments[1];

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
