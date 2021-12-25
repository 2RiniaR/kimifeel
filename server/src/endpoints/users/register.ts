import { Endpoint, EndpointParamsBase } from "../base";

export type RegisterUserEndpointParams = EndpointParamsBase;

export type RegisterUserEndpointResult = {
  discordId: string;
};

export class RegisterUserEndpoint extends Endpoint<RegisterUserEndpointParams, RegisterUserEndpointResult> {}
