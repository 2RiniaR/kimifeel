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
