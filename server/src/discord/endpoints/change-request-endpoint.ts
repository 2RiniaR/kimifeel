import { Endpoint, EndpointParamsBase } from "../endpoint";

export type ChangeRequestControlType = "accept" | "deny" | "cancel";

export type ChangeRequestParams = EndpointParamsBase & {
  targetDiscordId: string;
  index: number;
  controlType: ChangeRequestControlType;
};

export type ChangeRequestResult = {
  index: number;
  content: string;
  authorDiscordId: string;
};

export class ChangeRequestEndpoint extends Endpoint<ChangeRequestParams, ChangeRequestResult> {}
