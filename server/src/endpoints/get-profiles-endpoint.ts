import { Endpoint, EndpointParamsBase } from "../endpoint";
import { ProfileMarkdownProps } from "../discord/views";

export type GetProfilesEndpointConditions = {
  ownerDiscordId?: string;
  authorDiscordId?: string;
  content?: string;
};

export type GetProfilesEndpointParams = EndpointParamsBase &
  (
    | ({
        method: "oldest" | "latest";
        page: number;
      } & GetProfilesEndpointConditions)
    | ({
        method: "random";
      } & GetProfilesEndpointConditions)
    | {
        method: "specific";
        ownerDiscordId: string;
        index: number;
      }
  );

export type GetProfilesEndpointResult = ProfileMarkdownProps[];

export class GetProfilesEndpoint extends Endpoint<GetProfilesEndpointParams, GetProfilesEndpointResult> {}
