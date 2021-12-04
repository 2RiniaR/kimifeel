import { EndpointError } from "./endpoint-error";

export class ProfileNotFoundEndpointError extends EndpointError {
  public readonly title = "対象のプロフィールは見つかりませんでした。";
  public readonly message = "存在しない、または既に削除された可能性があります。";
  public readonly messageType = "invalid";
}
