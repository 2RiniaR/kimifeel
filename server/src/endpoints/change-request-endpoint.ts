import { Endpoint, EndpointParamsBase } from "../endpoint";

export type ChangeRequestControlType = "accept" | "deny" | "cancel";

export type ChangeRequestEndpointParams = EndpointParamsBase & {
  targetDiscordId: string;
  index: number;
  controlType: ChangeRequestControlType;
};

export type ChangeRequestEndpointResult = {
  index: number;
  content: string;
  authorDiscordId: string;
};

export class ChangeRequestEndpoint extends Endpoint<ChangeRequestEndpointParams, ChangeRequestEndpointResult> {}
