import { UserResult, UserStats } from "./structures";

export type CheckMentionableParams = {
  targetUsersDiscordId: string[];
};
export type CheckMentionableResult = {
  [discordId in string]: boolean;
};

export type GetStatsParams = {
  targetUserDiscordId: string;
};
export type GetStatsResult = UserStats;

export type ConfigParams = {
  enableMention?: boolean;
};
export type ConfigResult = UserResult;

export interface UserEndpointResponder {
  register(clientDiscordId: string): PromiseLike<void>;
  unregister(clientDiscordId: string): PromiseLike<void>;
  getStats(clientDiscordId: string, params: GetStatsParams): PromiseLike<GetStatsResult>;
  checkMentionable(clientDiscordId: string, params: CheckMentionableParams): PromiseLike<CheckMentionableResult>;
  config(clientDiscordId: string, params: ConfigParams): PromiseLike<ConfigResult>;
}

export class UserEndpoint {
  readonly responder: UserEndpointResponder;

  constructor(responder: UserEndpointResponder) {
    this.responder = responder;
  }

  register(clientDiscordId: string): PromiseLike<void> {
    return this.responder.register(clientDiscordId);
  }

  unregister(clientDiscordId: string): PromiseLike<void> {
    return this.responder.unregister(clientDiscordId);
  }

  checkMentionable(clientDiscordId: string, params: CheckMentionableParams): PromiseLike<CheckMentionableResult> {
    return this.responder.checkMentionable(clientDiscordId, params);
  }

  getStats(clientDiscordId: string, params: GetStatsParams): PromiseLike<GetStatsResult> {
    return this.responder.getStats(clientDiscordId, params);
  }

  config(clientDiscordId: string, params: ConfigParams): PromiseLike<ConfigResult> {
    return this.responder.config(clientDiscordId, params);
  }
}
