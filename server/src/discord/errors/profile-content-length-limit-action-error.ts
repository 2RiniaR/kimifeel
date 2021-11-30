import { ActionError } from "./action-error";

export class ProfileContentLengthLimitActionError extends ActionError {
  public readonly limit: number;
  public readonly actual: number;
  public readonly message: string;
  public readonly messageType = "invalid";

  public constructor(limit: number, actual: number) {
    super();
    this.limit = limit;
    this.actual = actual;
    this.message = `プロフィールの本文が長すぎます。${this.limit.toString()}文字以下にしてください。（現在: ${this.actual.toString()}文字）`;
  }
}
