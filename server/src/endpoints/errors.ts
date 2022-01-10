import { ProfileIdentifier, RequestIdentifier, UserIdentifier } from "./structures";

export abstract class EndpointError extends Error {}

export class ClientUserNotExistError extends EndpointError {
  readonly identifier: UserIdentifier;

  constructor(identifier: UserIdentifier) {
    super();
    this.identifier = identifier;
  }
}

export class ProfileNotFoundError extends EndpointError {
  readonly identifier: ProfileIdentifier;

  constructor(identifier: ProfileIdentifier) {
    super();
    this.identifier = identifier;
  }
}

export class UserNotFoundError extends EndpointError {
  readonly identifier: UserIdentifier;

  constructor(identifier: UserIdentifier) {
    super();
    this.identifier = identifier;
  }
}

export class RequestNotFoundError extends EndpointError {
  readonly identifier: RequestIdentifier;

  constructor(identifier: RequestIdentifier) {
    super();
    this.identifier = identifier;
  }
}

export class ContentLengthLimitError extends EndpointError {
  public readonly min: number;
  public readonly max: number;
  public readonly actual: number;

  public constructor(min: number, max: number, actual: number) {
    super();
    this.min = min;
    this.max = max;
    this.actual = actual;
  }
}

export class SendRequestOwnError extends EndpointError {
  readonly identifier: UserIdentifier;

  constructor(identifier: UserIdentifier) {
    super();
    this.identifier = identifier;
  }
}

export class UserAlreadyRegisteredError extends EndpointError {
  readonly identifier: UserIdentifier;

  constructor(identifier: UserIdentifier) {
    super();
    this.identifier = identifier;
  }
}

export class ParameterFormatInvalidError<T> extends EndpointError {
  readonly key: keyof T;
  readonly format: string;

  constructor(key: keyof T, format: string) {
    super();
    this.key = key;
    this.format = format;
  }
}
