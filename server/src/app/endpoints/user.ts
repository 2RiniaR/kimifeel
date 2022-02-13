import { UserBody, UserConfigParams, UserSpecifier, UserStatsBody } from "./structures";

export interface UserEndpoint {
  getStats(clientId: string, params: UserSpecifier): PromiseLike<UserStatsBody>;
  findMany(clientId: string, params: UserSpecifier[]): PromiseLike<UserBody[]>;
  config(clientId: string, params: UserConfigParams): PromiseLike<UserBody>;
}
