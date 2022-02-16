import { AuthParams } from "./structures";

export class UserNotFoundError extends Error {
  public constructor(public readonly specifier: AuthParams) {
    super();
  }
}
export class UserAlreadyRegisteredError extends Error {
  public constructor(public readonly specifier: AuthParams) {
    super();
  }
}

export class UnavailableError extends Error {
  public constructor() {
    super();
  }
}
