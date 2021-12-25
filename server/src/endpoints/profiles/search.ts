import { Endpoint, EndpointParamsBase } from "../base";
import { ProfileMarkdownProps } from "../../discord/views";

export type SearchProfilesEndpointParams = EndpointParamsBase & {
  order: "oldest" | "latest";
  page: number;
  ownerDiscordId?: string;
  authorDiscordId?: string;
  content?: string;
};

export type SearchProfilesEndpointResult = ProfileMarkdownProps[];

export class SearchProfilesEndpoint extends Endpoint<SearchProfilesEndpointParams, SearchProfilesEndpointResult> {}
