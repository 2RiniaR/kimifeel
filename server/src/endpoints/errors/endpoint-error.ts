export class EndpointError extends Error {
  public readonly title?: string;

  public constructor(title?: string) {
    super();
    this.title = title;
  }
}
