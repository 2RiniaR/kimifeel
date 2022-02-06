import { CreateRequestParams, ProfileBody, RequestBody, RequestSpecifier, SearchRequestParams } from "./structures";

export interface RequestEndpointResponder {
  accept(clientId: string, params: RequestSpecifier): PromiseLike<ProfileBody>;
  cancel(clientId: string, params: RequestSpecifier): PromiseLike<RequestBody>;
  create(clientId: string, params: CreateRequestParams): PromiseLike<RequestBody>;
  deny(clientId: string, params: RequestSpecifier): PromiseLike<RequestBody>;
  find(clientId: string, params: RequestSpecifier): PromiseLike<RequestBody>;
  search(clientId: string, params: SearchRequestParams): PromiseLike<RequestBody[]>;
}

export class RequestEndpoint {
  constructor(private readonly responder: RequestEndpointResponder) {}

  accept(clientId: string, params: RequestSpecifier): PromiseLike<ProfileBody> {
    return this.responder.accept(clientId, params);
  }

  cancel(clientId: string, params: RequestSpecifier): PromiseLike<RequestBody> {
    return this.responder.cancel(clientId, params);
  }

  create(clientId: string, params: CreateRequestParams): PromiseLike<RequestBody> {
    return this.responder.create(clientId, params);
  }

  deny(clientId: string, params: RequestSpecifier): PromiseLike<RequestBody> {
    return this.responder.deny(clientId, params);
  }

  find(clientId: string, params: RequestSpecifier): PromiseLike<RequestBody> {
    return this.responder.find(clientId, params);
  }

  search(clientId: string, params: SearchRequestParams): PromiseLike<RequestBody[]> {
    return this.responder.search(clientId, params);
  }
}
