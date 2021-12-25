import { Endpoint, EndpointParamsBase } from "../base";
import { RequestMarkdownProps } from "../../discord/views";

export type SearchRequestsEndpointParams = EndpointParamsBase & {
  status: "sent" | "received";
  order: "oldest" | "latest";
  page: number;
  content?: string;
  targetDiscordId?: string;
  applicantDiscordId?: string;
};

export type SearchRequestsEndpointResult = RequestMarkdownProps[];

export class SearchRequestsEndpoint extends Endpoint<SearchRequestsEndpointParams, SearchRequestsEndpointResult> {}
