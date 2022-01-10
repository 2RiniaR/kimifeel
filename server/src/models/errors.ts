export class ForbiddenError extends Error {}
export class NotFoundError extends Error {}

export class InvalidParameterError<T> extends Error {
  readonly key: keyof T;
  readonly format: string;

  constructor(key: keyof T, format: string) {
    super();
    this.key = key;
    this.format = format;
  }
}
