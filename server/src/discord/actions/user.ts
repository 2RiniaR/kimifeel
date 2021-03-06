import * as Auth from "auth";
import * as App from "app";
import { Communicator } from "./communicator";
import { DiscordUser, DiscordUserIdentity, DiscordUserStats, SystemMessage } from "../structures";
import { toUser, toUserIdentity, toUserStats } from "./converters";
import { authorize } from "./auth";
import { ErrorAction, withConvertAppErrors, withConvertAuthErrors } from "./errors";

export interface UserMessageGenerator {
  registered(user: DiscordUserIdentity): SystemMessage;
  configured(user: DiscordUser): SystemMessage;
  stats(stats: DiscordUserStats): SystemMessage;
}

export type ConfigUserProps = {
  readonly enableMention?: boolean;
};

export type ShowUserStatsProps = {
  readonly userId: string;
};

export class UserAction {
  constructor(
    private readonly authEndpoint: Auth.AuthEndpoint,
    private readonly userEndpoint: App.UserEndpoint,
    private readonly messageGenerator: UserMessageGenerator,
    private readonly errorAction: ErrorAction
  ) {}

  public async register(communicator: Communicator) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      communicator.getProps();
      const senderId = communicator.getSender().id;
      const result = await withConvertAuthErrors.invokeAsync(() => this.authEndpoint.register({ discordId: senderId }));

      const user = toUserIdentity(result);
      const replyMessage = this.messageGenerator.registered(user);
      await communicator.reply(replyMessage, { showOnlySender: true });
    });
  }

  public async config(communicator: Communicator<ConfigUserProps>) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      const props = communicator.getProps();

      const { id } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invokeAsync(() =>
        this.userEndpoint.config(id, {
          enableMention: props.enableMention
        })
      );

      const user = toUser(result);
      const replyMessage = this.messageGenerator.configured(user);
      await communicator.reply(replyMessage, { mentions: [user], showOnlySender: true });
    });
  }

  public async showStats(communicator: Communicator<ShowUserStatsProps>) {
    await this.errorAction.withErrorResponses(communicator).invokeAsync(async () => {
      const props = communicator.getProps();

      const { id } = await authorize(this.authEndpoint, communicator);
      const result = await withConvertAppErrors.invokeAsync(() =>
        this.userEndpoint.getStats(id, { discordId: props.userId })
      );

      const stats = toUserStats(result);
      const replyMessage = this.messageGenerator.stats(stats);
      await communicator.reply(replyMessage);
    });
  }
}
