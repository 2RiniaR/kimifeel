import { ActionError } from "./action-error";

export class RequestNotFoundActionError extends ActionError {
  public readonly title = "対象のリクエストは見つかりませんでした。";
  public readonly message = "存在しない、または既に承認・拒否・キャンセルされた可能性があります。";
  public readonly messageType = "invalid";
}