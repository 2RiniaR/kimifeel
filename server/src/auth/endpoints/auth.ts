import { AuthParams, ClientBody } from "./structures";

export interface AuthEndpoint {
  register(params: AuthParams): PromiseLike<ClientBody>;
  unregister(params: AuthParams): PromiseLike<ClientBody>;
  authorize(params: AuthParams): PromiseLike<ClientBody>;
}
