import { Endpoint, EndpointParamsBase } from "../endpoint";
import { ProfileMarkdownProps } from "../views";

export type GetProfilesConditions = {
  ownerDiscordId?: string;
  authorDiscordId?: string;
  content?: string;
};

export type GetProfilesParams = EndpointParamsBase &
  (
    | ({
        method: "oldest" | "latest";
        page: number;
      } & GetProfilesConditions)
    | ({
        method: "random";
      } & GetProfilesConditions)
    | {
        method: "specific";
        ownerDiscordId: string;
        index: number;
      }
  );

export type GetProfilesResult = ProfileMarkdownProps[];

export class GetProfilesEndpoint extends Endpoint<GetProfilesParams, GetProfilesResult> {}
