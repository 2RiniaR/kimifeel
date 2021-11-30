import { ActionError } from "./action-error";

export class ProfileNotFoundActionError extends ActionError {
  public readonly title = "対象のプロフィールは見つかりませんでした。";
  public readonly message = "存在しない、または既に削除された可能性があります。";
  public readonly messageType = "invalid";
}
