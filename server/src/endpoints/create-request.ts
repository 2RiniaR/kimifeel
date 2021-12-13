import { Endpoint, EndpointParamsBase } from "./base";
import { RequestMarkdownProps } from "discord/views";

export type CreateRequestEndpointParams = EndpointParamsBase & {
  targetDiscordId: string;
  content: string;
};

export type CreateRequestEndpointResult = RequestMarkdownProps;

export class CreateRequestEndpoint extends Endpoint<CreateRequestEndpointParams, CreateRequestEndpointResult> {}
