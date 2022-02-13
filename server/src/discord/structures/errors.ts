import { ProfileIdentity } from "./profile";
import { RequestIdentity } from "./request";
import { DiscordUserIdentity } from "./discord-user";

export class ProfileNotFoundError extends Error {
  public constructor(public readonly profile?: ProfileIdentity) {
    super();
  }
}

export class RequestNotFoundError extends Error {
  public constructor(public readonly request?: RequestIdentity) {
    super();
  }
}

export class UserNotFoundError extends Error {
  public constructor(public readonly user?: DiscordUserIdentity) {
    super();
  }
}

export class UserNotRegisteredError extends Error {}

export class ProfileContentLengthLimitError extends Error {
  public constructor(public readonly min: number, public readonly max: number, public readonly actual: number) {
    super();
  }
}

export class SentRequestOwnError extends Error {}

export class UnavailableError extends Error {}

export class InvalidFormatError extends Error {
  public constructor(public readonly position: string, public readonly format: string) {
    super();
  }
}

export class UserAlreadyRegisteredError extends Error {
  public constructor(public readonly user: DiscordUserIdentity) {
    super();
  }
}

export class CommandArgumentUnexpectedError extends Error {
  public constructor(public readonly expected: number, public readonly actual: number) {
    super();
  }
}

export class CommandOptionUnexpectedError extends Error {
  public constructor(public readonly names: readonly string[]) {
    super();
  }
}

export class ReadMessageFailedError extends Error {}
