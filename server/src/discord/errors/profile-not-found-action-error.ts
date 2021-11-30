import { ActionError } from "./action-error";

export class ProfileNotFoundActionError extends ActionError {
  public readonly message =
    "対象のプロフィールは見つかりませんでした。存在しない、または既に削除された可能性があります。";
  public readonly messageType = "invalid";
}
