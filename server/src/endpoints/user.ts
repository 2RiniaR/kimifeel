import { UserConfig, UserStatistics } from "./structures";

export type ShowParams = {
  targetUserDiscordId: string;
};
export type ShowResult = UserStatistics;

export type ConfigParams = {
  enableMention?: boolean;
};
export type ConfigResult = UserConfig;

export interface UserEndpointResponder {
  register(clientDiscordId: string): PromiseLike<void>;
  unregister(clientDiscordId: string): PromiseLike<void>;
  show(clientDiscordId: string, params: ShowParams): PromiseLike<ShowResult>;
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

  show(clientDiscordId: string, params: ShowParams): PromiseLike<ShowResult> {
    return this.responder.show(clientDiscordId, params);
  }

  config(clientDiscordId: string, params: ConfigParams): PromiseLike<ConfigResult> {
    return this.responder.config(clientDiscordId, params);
  }
}
