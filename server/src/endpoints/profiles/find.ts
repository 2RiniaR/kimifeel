import { Endpoint, EndpointParamsBase } from "../base";
import { ProfileMarkdownProps } from "../../discord/views";

export type FindProfileEndpointParams = EndpointParamsBase & {
  ownerDiscordId: string;
  index: number;
};

export type FindProfilesEndpointResult = ProfileMarkdownProps;

export class FindProfilesEndpoint extends Endpoint<FindProfileEndpointParams, FindProfilesEndpointResult> {}
