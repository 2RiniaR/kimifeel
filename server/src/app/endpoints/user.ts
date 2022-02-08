import { UserBody, UserConfigParams, UserSpecifier, UserStatsBody } from "./structures";

export interface UserEndpointResponder {
  getStats(clientId: string, params: UserSpecifier): PromiseLike<UserStatsBody>;
  findMany(clientId: string, params: UserSpecifier[]): PromiseLike<UserBody[]>;
  config(clientId: string, params: UserConfigParams): PromiseLike<UserBody>;
}

export class UserEndpoint {
  readonly responder: UserEndpointResponder;

  constructor(responder: UserEndpointResponder) {
    this.responder = responder;
  }

  findMany(clientId: string, params: UserSpecifier[]): PromiseLike<UserBody[]> {
    return this.responder.findMany(clientId, params);
  }

  getStats(clientId: string, params: UserSpecifier): PromiseLike<UserStatsBody> {
    return this.responder.getStats(clientId, params);
  }

  config(clientId: string, params: UserConfigParams): PromiseLike<UserBody> {
    return this.responder.config(clientId, params);
  }
}
