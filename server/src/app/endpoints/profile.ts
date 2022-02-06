import {
  CreateProfileParams,
  ProfileBody,
  ProfileCondition,
  ProfileSpecifier,
  SearchProfileParams
} from "./structures";

export interface ProfileEndpointResponder {
  create(clientId: string, params: CreateProfileParams): PromiseLike<ProfileBody>;
  delete(clientId: string, params: ProfileSpecifier): PromiseLike<ProfileBody>;
  find(clientId: string, params: ProfileSpecifier): PromiseLike<ProfileBody>;
  random(clientId: string, params: ProfileCondition): PromiseLike<ProfileBody[]>;
  search(clientId: string, params: SearchProfileParams): PromiseLike<ProfileBody[]>;
}

export class ProfileEndpoint {
  constructor(private readonly responder: ProfileEndpointResponder) {}

  create(clientId: string, params: CreateProfileParams): PromiseLike<ProfileBody> {
    return this.responder.create(clientId, params);
  }

  delete(clientId: string, params: ProfileSpecifier): PromiseLike<ProfileBody> {
    return this.responder.delete(clientId, params);
  }

  find(clientId: string, params: ProfileSpecifier): PromiseLike<ProfileBody> {
    return this.responder.find(clientId, params);
  }

  random(clientId: string, params: ProfileCondition): PromiseLike<ProfileBody[]> {
    return this.responder.random(clientId, params);
  }

  search(clientId: string, params: SearchProfileParams): PromiseLike<ProfileBody[]> {
    return this.responder.search(clientId, params);
  }
}
