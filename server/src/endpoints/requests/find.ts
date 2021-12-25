import { Endpoint, EndpointParamsBase } from "../base";
import { RequestMarkdownProps } from "../../discord/views";

export type FindRequestEndpointParams = EndpointParamsBase & {
  targetDiscordId: string;
  index: number;
};

export type FindRequestEndpointResult = RequestMarkdownProps;

export class FindRequestEndpoint extends Endpoint<FindRequestEndpointParams, FindRequestEndpointResult> {}
