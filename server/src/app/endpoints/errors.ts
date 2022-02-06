import { ProfileSpecifier, RequestSpecifier, UserSpecifier } from "./structures";

export abstract class EndpointError extends Error {}

export class ClientUserNotExistError extends EndpointError {}

export class ProfileNotFoundError extends EndpointError {
  constructor(public readonly specifier: ProfileSpecifier) {
    super();
  }
}

export class UserNotFoundError extends EndpointError {
  constructor(public readonly specifier: UserSpecifier) {
    super();
  }
}

export class RequestNotFoundError extends EndpointError {
  constructor(public readonly specifier: RequestSpecifier) {
    super();
  }
}

export class ContentLengthLimitError extends EndpointError {
  public constructor(public readonly min: number, public readonly max: number, public readonly actual: number) {
    super();
  }
}

export class SendRequestOwnError extends EndpointError {}

export class ParameterFormatInvalidError<T> extends EndpointError {
  constructor(public readonly key: keyof T, public readonly format: string) {
    super();
  }
}

export class UnavailableError extends EndpointError {}
