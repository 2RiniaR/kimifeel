import { Endpoint, EndpointParamsBase } from "../base";
import { ProfileMarkdownProps } from "../../discord/views";

export type FindProfileEndpointParams = EndpointParamsBase & {
  index: number;
};

export type FindProfileEndpointResult = ProfileMarkdownProps;

export class FindProfileEndpoint extends Endpoint<FindProfileEndpointParams, FindProfileEndpointResult> {}
