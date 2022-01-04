import { Endpoint, EndpointParamsBase } from "../base";
import { RequestMarkdownProps } from "discord/views";
import { EndpointError } from "../errors/base";

export class ContentLengthLimitError extends EndpointError {
  public readonly min: number;
  public readonly max: number;
  public readonly actual: number;
  public readonly message: string;
  public readonly title = "プロフィールの本文が長すぎます。";

  public constructor(min: number, max: number, actual: number) {
    super();
    this.min = min;
    this.max = max;
    this.actual = actual;
    this.message = `${this.min.toString()}文字以下・${this.max.toString()}文字以下にしてください。（現在: ${this.actual.toString()}文字）`;
  }
}

export type CreateRequestEndpointParams = EndpointParamsBase & {
  targetDiscordId: string;
  content: string;
};

export type CreateRequestEndpointResult = RequestMarkdownProps;

export class CreateRequestEndpoint extends Endpoint<CreateRequestEndpointParams, CreateRequestEndpointResult> {}
