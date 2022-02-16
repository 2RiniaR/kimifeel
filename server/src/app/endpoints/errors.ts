import { ProfileSpecifier, RequestSpecifier, UserSpecifier } from "./structures";

export class ClientUserNotExistError extends Error {
  public constructor() {
    super();
  }
}

export class ProfileNotFoundError extends Error {
  public constructor(public readonly specifier: ProfileSpecifier) {
    super();
  }
}

export class UserNotFoundError extends Error {
  public constructor(public readonly specifier: UserSpecifier) {
    super();
  }
}

export class RequestNotFoundError extends Error {
  public constructor(public readonly specifier: RequestSpecifier) {
    super();
  }
}

export class ContentLengthLimitError extends Error {
  public constructor(public readonly min: number, public readonly max: number, public readonly actual: number) {
    super();
  }
}

export class SentRequestOwnError extends Error {
  public constructor() {
    super();
  }
}

export class ParameterStructureInvalidError extends Error {
  public constructor() {
    super();
  }
}

export class ParameterFormatInvalidError<T> extends Error {
  public constructor(public readonly key: keyof T, public readonly format: string) {
    super();
  }
}

export class UnavailableError extends Error {
  public constructor() {
    super();
  }
}
