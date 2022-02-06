import { UserEndpoint } from "app/endpoints/user";
import { ProfileEndpoint } from "app/endpoints/profile";
import { RequestEndpoint } from "app/endpoints/request";

export type Endpoints = {
  profile: ProfileEndpoint;
  request: RequestEndpoint;
  user: UserEndpoint;
};
