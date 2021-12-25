import { Endpoint, EndpointParamsBase } from "../base";

export type UnregisterUserEndpointParams = EndpointParamsBase;

export type UnregisterUserEndpointResult = { discordId: string };

export class UnregisterUserEndpoint extends Endpoint<UnregisterUserEndpointParams, UnregisterUserEndpointResult> {}
