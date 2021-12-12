import { EndpointError } from "./base";

export class ProfileContentLengthLimitEndpointError extends EndpointError {
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
