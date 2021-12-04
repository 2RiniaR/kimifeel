import { Endpoint, EndpointParamsBase } from "../endpoint";

export type CreateRequestEndpointParams = EndpointParamsBase & {
  targetDiscordId: string;
  content: string;
};

export type CreateRequestEndpointResult = {
  index: number;
};

export class CreateRequestEndpoint extends Endpoint<CreateRequestEndpointParams, CreateRequestEndpointResult> {}
