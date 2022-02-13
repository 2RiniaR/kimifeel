import { CreateRequestParams, ProfileBody, RequestBody, RequestSpecifier, SearchRequestParams } from "./structures";

export interface RequestEndpoint {
  accept(clientId: string, params: RequestSpecifier): PromiseLike<ProfileBody>;
  cancel(clientId: string, params: RequestSpecifier): PromiseLike<RequestBody>;
  create(clientId: string, params: CreateRequestParams): PromiseLike<RequestBody>;
  deny(clientId: string, params: RequestSpecifier): PromiseLike<RequestBody>;
  find(clientId: string, params: RequestSpecifier): PromiseLike<RequestBody>;
  search(clientId: string, params: SearchRequestParams): PromiseLike<RequestBody[]>;
}
