export class ContentLengthLimitError extends Error {
  public readonly limit: number;
  public readonly actual: number;

  public constructor(limit: number, actual: number) {
    super();
    this.limit = limit;
    this.actual = actual;
  }
}
