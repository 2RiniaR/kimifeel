import { Endpoint, EndpointParamsBase } from "./base";

export type DeleteProfileEndpointParams = EndpointParamsBase & {
  index: number;
};

export type DeleteProfileEndpointResult = {
  index: number;
  content: string;
  authorDiscordId: string;
};

export class DeleteProfileEndpoint extends Endpoint<DeleteProfileEndpointParams, DeleteProfileEndpointResult> {}
