import { Endpoint, EndpointParamsBase } from "./base";
import { RequestMarkdownProps } from "discord/views";

export type DenyRequestEndpointParams = EndpointParamsBase & {
  index: number;
};

export type DenyRequestEndpointResult = RequestMarkdownProps;

export class DenyRequestEndpoint extends Endpoint<DenyRequestEndpointParams, DenyRequestEndpointResult> {}
