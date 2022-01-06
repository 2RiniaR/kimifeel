import { ProfileResult } from "./structures";

export type DeleteParams = {
  index: number;
};
export type DeleteResult = ProfileResult;

export type FindParams = {
  index: number;
};
export type FindResult = ProfileResult;

export type RandomParams = {
  ownerDiscordId?: string;
  authorDiscordId?: string;
  content?: string;
};
export type RandomResult = ProfileResult[];

export type SearchParams = {
  order: "oldest" | "latest";
  page: number;
  ownerDiscordId?: string;
  authorDiscordId?: string;
  content?: string;
};
export type SearchResult = ProfileResult[];

export interface ProfileEndpointResponder {
  delete(clientDiscordId: string, params: DeleteParams): PromiseLike<DeleteResult>;
  find(clientDiscordId: string, params: FindParams): PromiseLike<FindResult>;
  random(clientDiscordId: string, params: RandomParams): PromiseLike<RandomResult>;
  search(clientDiscordId: string, params: SearchParams): PromiseLike<SearchResult>;
}

export class ProfileEndpoint {
  readonly responder: ProfileEndpointResponder;

  constructor(responder: ProfileEndpointResponder) {
    this.responder = responder;
  }

  delete(clientDiscordId: string, params: DeleteParams): PromiseLike<DeleteResult> {
    return this.responder.delete(clientDiscordId, params);
  }

  find(clientDiscordId: string, params: FindParams): PromiseLike<FindResult> {
    return this.responder.find(clientDiscordId, params);
  }

  random(clientDiscordId: string, params: RandomParams): PromiseLike<RandomResult> {
    return this.responder.random(clientDiscordId, params);
  }

  search(clientDiscordId: string, params: SearchParams): PromiseLike<SearchResult> {
    return this.responder.search(clientDiscordId, params);
  }
}
