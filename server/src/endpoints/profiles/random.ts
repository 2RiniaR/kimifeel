import { Endpoint, EndpointParamsBase } from "../base";
import { ProfileMarkdownProps } from "../../discord/views";

export type RandomProfilesEndpointParams = EndpointParamsBase & {
  ownerDiscordId?: string;
  authorDiscordId?: string;
  content?: string;
};

export type RandomProfilesEndpointResult = ProfileMarkdownProps[];

export class RandomProfilesEndpoint extends Endpoint<RandomProfilesEndpointParams, RandomProfilesEndpointResult> {}
