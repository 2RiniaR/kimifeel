import { ActionError } from "./action-error";

export class NoBotActionError extends ActionError {
  public readonly title = "ボットユーザーを選択することはできません。";
  public readonly messageType = "invalid";
}
