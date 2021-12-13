import { Endpoint, EndpointParamsBase } from "./base";
import { ProfileMarkdownProps } from "discord/views";

export type AcceptRequestEndpointParams = EndpointParamsBase & {
  index: number;
};

export type AcceptRequestEndpointResult = ProfileMarkdownProps;

export class AcceptRequestEndpoint extends Endpoint<AcceptRequestEndpointParams, AcceptRequestEndpointResult> {}
