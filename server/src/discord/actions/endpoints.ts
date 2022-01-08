import { UserEndpoint } from "endpoints/user";
import { ProfileEndpoint } from "endpoints/profile";
import { RequestEndpoint } from "endpoints/request";

export type Endpoints = {
  profile: ProfileEndpoint;
  request: RequestEndpoint;
  user: UserEndpoint;
};
