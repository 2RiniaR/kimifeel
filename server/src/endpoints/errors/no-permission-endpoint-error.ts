import { EndpointError } from "./endpoint-error";

export class NoPermissionEndpointError extends EndpointError {
  public readonly title = "操作が無効です。";
}
