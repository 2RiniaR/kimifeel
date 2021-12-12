import { GuildMember } from "discord.js";
import { ErrorEmbed, RequestEmbed } from "discord/views";
import { MessageCommandEvent, MessageCommandEventContext, MessageCommandEventOptions } from "discord/events";
import { ActionSessionIn } from "discord/actions/action-session";
import { DiscordFetchFailedActionError, NoBotActionError } from "discord/actions/errors";
import { ActionWith } from "discord/actions/action";
import { CreateRequestEndpoint, CreateRequestEndpointParams, CreateRequestEndpointResult } from "endpoints";
import { ReactionChangeRequestAction } from "../reaction/reaction-change-request-action";
import { basePhrase } from "./phrases";
import { targetGuildManager } from "../../index";

export class MessageCommandSendRequestAction extends ActionWith<MessageCommandEvent, CreateRequestEndpoint> {
  readonly options: MessageCommandEventOptions = {
    prefixes: [`${basePhrase} send-request`, `${basePhrase} request send`],
    allowBot: false
  };

  async onEvent(context: MessageCommandEventContext) {
    await new MessageCommandSendRequestSession(context, this.endpoint).run();
  }
}

class MessageCommandSendRequestSession extends ActionSessionIn<MessageCommandSendRequestAction> {
  private target!: GuildMember;
  private content!: string;

  protected async fetch(): Promise<CreateRequestEndpointParams> {
    await Promise.resolve();
    if (this.context.arguments.length < 2) throw new Error();

    const targetId = this.context.arguments[0];
    const target = await targetGuildManager.getMember(targetId);
    if (!target) throw new DiscordFetchFailedActionError();
    this.target = target;
    if (this.target.user.bot) {
      throw new NoBotActionError();
    }

    this.content = this.context.arguments[1];

    return {
      clientDiscordId: this.context.member.id,
      targetDiscordId: this.target.id,
      content: this.content
    };
  }

  protected async onSucceed(result: CreateRequestEndpointResult) {
    const embed = new RequestEmbed({
      index: result.index,
      requesterUserName: this.context.member.displayName,
      requesterUserAvatarURL: this.context.member.displayAvatarURL(),
      requesterUserId: this.context.member.id,
      content: this.content,
      targetUserName: this.target.displayName,
      targetUserId: this.target.id
    });

    const message = await this.context.message.reply({ embeds: [embed] });
    const emojiCharacters = Object.keys(ReactionChangeRequestAction.emojiToChange);
    await emojiCharacters.mapAsync((emoji) => message.react(emoji));
  }

  protected async onFailed(error: unknown) {
    const embed = new ErrorEmbed(error);
    await this.context.message.reply({ embeds: [embed] });
  }
}
