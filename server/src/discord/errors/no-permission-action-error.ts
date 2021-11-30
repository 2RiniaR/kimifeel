import { ActionError } from "./action-error";

export class NoPermissionActionError extends ActionError {
  public readonly title = "操作が無効です。";
  public readonly messageType = "invalid";
}
