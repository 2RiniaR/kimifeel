import { Endpoint, EndpointParamsBase } from "../base";
import { ProfileMarkdownProps } from "../../discord/views";

export type DeleteProfileEndpointParams = EndpointParamsBase & {
  index: number;
};

export type DeleteProfileEndpointResult = ProfileMarkdownProps;

export class DeleteProfileEndpoint extends Endpoint<DeleteProfileEndpointParams, DeleteProfileEndpointResult> {}
