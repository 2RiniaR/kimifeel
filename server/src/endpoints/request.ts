import { ProfileResult, RequestResult } from "./structures";

export type AcceptParams = {
  index: number;
};
export type AcceptResult = ProfileResult;

export type CancelParams = {
  index: number;
};
export type CancelResult = RequestResult;

export type CreateParams = {
  targetDiscordId: string;
  content: string;
};
export type CreateResult = RequestResult;

export type DenyParams = {
  index: number;
};
export type DenyResult = RequestResult;

export type FindParams = {
  index: number;
};
export type FindResult = RequestResult;

export type SearchParams = {
  status: "sent" | "received";
  order: "oldest" | "latest";
  page: number;
  content?: string;
  targetDiscordId?: string;
  applicantDiscordId?: string;
};
export type SearchResult = RequestResult[];

export interface RequestEndpointResponder {
  accept(clientDiscordId: string, params: AcceptParams): PromiseLike<AcceptResult>;
  cancel(clientDiscordId: string, params: CancelParams): PromiseLike<CancelResult>;
  create(clientDiscordId: string, params: CreateParams): PromiseLike<CreateResult>;
  deny(clientDiscordId: string, params: DenyParams): PromiseLike<DenyResult>;
  find(clientDiscordId: string, params: FindParams): PromiseLike<FindResult>;
  search(clientDiscordId: string, params: SearchParams): PromiseLike<SearchResult>;
}

export class RequestEndpoint {
  readonly responder: RequestEndpointResponder;

  constructor(responder: RequestEndpointResponder) {
    this.responder = responder;
  }

  accept(clientDiscordId: string, params: AcceptParams): PromiseLike<AcceptResult> {
    return this.responder.accept(clientDiscordId, params);
  }

  cancel(clientDiscordId: string, params: CancelParams): PromiseLike<CancelResult> {
    return this.responder.cancel(clientDiscordId, params);
  }

  create(clientDiscordId: string, params: CreateParams): PromiseLike<CreateResult> {
    return this.responder.create(clientDiscordId, params);
  }

  deny(clientDiscordId: string, params: DenyParams): PromiseLike<DenyResult> {
    return this.responder.deny(clientDiscordId, params);
  }

  find(clientDiscordId: string, params: FindParams): PromiseLike<FindResult> {
    return this.responder.find(clientDiscordId, params);
  }

  search(clientDiscordId: string, params: SearchParams): PromiseLike<SearchResult> {
    return this.responder.search(clientDiscordId, params);
  }
}
