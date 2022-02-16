import { ConnectionError } from "data-store";
import { emptyErrorPipeline } from "helpers/catch";

export class ForbiddenError extends Error {
  public constructor() {
    super();
  }
}

export class NotFoundError extends Error {
  public constructor() {
    super();
  }
}

export class DataAccessFailedError extends Error {
  public constructor() {
    super();
  }
}

export class SubmitRequestOwnError extends Error {
  public constructor() {
    super();
  }
}

export class InvalidParameterError<T> extends Error {
  public constructor(public readonly key: keyof T, public readonly format: string) {
    super();
  }
}

export class ContentLengthLimitError extends Error {
  public constructor(public readonly min: number, public readonly max: number, public readonly actual: number) {
    super();
  }
}

export const withConvertRepositoryErrors = emptyErrorPipeline.guard((error) => {
  if (error instanceof ConnectionError) throw new DataAccessFailedError();
});
