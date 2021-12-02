import { Endpoint, EndpointParamsBase } from "../endpoint";
import { ProfileMarkdownProps } from "../views";

type GetReceivedRequestsParams =
  | {
      method: "latest" | "oldest";
      page: number;
    }
  | {
      method: "specific";
      index: number;
    };

type GetSentRequestsParams =
  | {
      method: "latest" | "oldest";
      page: number;
    }
  | {
      method: "specific";
      targetDiscordId: string;
      index: number;
    };

export type GetRequestsParams = EndpointParamsBase &
  (({ genre: "received" } & GetReceivedRequestsParams) | ({ genre: "sent" } & GetSentRequestsParams));

export type GetRequestsResult = ProfileMarkdownProps[];

export class GetRequestsEndpoint extends Endpoint<GetRequestsParams, GetRequestsResult> {}
