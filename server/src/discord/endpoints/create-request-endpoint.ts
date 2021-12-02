import { Endpoint, EndpointParamsBase } from "../endpoint";

export type CreateRequestParams = EndpointParamsBase & {
  targetDiscordId: string;
  content: string;
};

export type CreateRequestResult = {
  index: number;
};

export class CreateRequestEndpoint extends Endpoint<CreateRequestParams, CreateRequestResult> {}
