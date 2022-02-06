import { ConnectionError } from "../../prisma";

export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}
export class DataAccessFailedError extends Error {}

export class UserAlreadyRegisteredError extends Error {}
export class SubmitRequestOwnError extends Error {}

export class InvalidParameterError<T> extends Error {
  readonly key: keyof T;
  readonly format: string;

  constructor(key: keyof T, format: string) {
    super();
    this.key = key;
    this.format = format;
  }
}

export class ContentLengthLimitError extends Error {
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

export function withHandleRepositoryErrors<TReturn>(inner: () => TReturn) {
  try {
    return inner();
  } catch (error) {
    if (error instanceof ConnectionError) throw new DataAccessFailedError();
    throw error;
  }
}
