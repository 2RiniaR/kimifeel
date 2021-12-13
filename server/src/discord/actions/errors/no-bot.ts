import { ActionError } from "./base";

export class NoBotActionError extends ActionError {
  public readonly title = "ボットユーザーを選択することはできません。";
  public readonly messageType = "invalid";
}
