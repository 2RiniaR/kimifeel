import {
  CreateProfileParams,
  ProfileBody,
  ProfileCondition,
  ProfileSpecifier,
  SearchProfileParams
} from "./structures";

export interface ProfileEndpoint {
  create(clientId: string, params: CreateProfileParams): PromiseLike<ProfileBody>;
  delete(clientId: string, params: ProfileSpecifier): PromiseLike<ProfileBody>;
  find(clientId: string, params: ProfileSpecifier): PromiseLike<ProfileBody>;
  random(clientId: string, params: ProfileCondition): PromiseLike<ProfileBody[]>;
  search(clientId: string, params: SearchProfileParams): PromiseLike<ProfileBody[]>;
}
