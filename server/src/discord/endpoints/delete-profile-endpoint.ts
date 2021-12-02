import { Endpoint, EndpointParamsBase } from "../endpoint";

export type DeleteProfileParams = EndpointParamsBase & {
  index: number;
};

export type DeleteProfileResult = {
  index: number;
  content: string;
  authorDiscordId: string;
};

export class DeleteProfileEndpoint extends Endpoint<DeleteProfileParams, DeleteProfileResult> {}
