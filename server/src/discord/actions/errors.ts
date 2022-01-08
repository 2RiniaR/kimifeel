export class ActionError extends Error {}

export class FetchFailedError extends ActionError {}

export class ParameterFormatInvalidError extends ActionError {
  readonly position: string;
  readonly format: string;

  constructor(position: string, format: string) {
    super();
    this.position = position;
    this.format = format;
  }
}
