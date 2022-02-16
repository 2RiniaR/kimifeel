import { ConnectionError } from "data-store";
import { emptyErrorPipeline } from "helpers/catch";

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

export class UserAlreadyRegisteredError extends Error {
  public constructor() {
    super();
  }
}

export const withConvertRepositoryErrors = emptyErrorPipeline.guard((error) => {
  if (error instanceof ConnectionError) throw new DataAccessFailedError();
});
