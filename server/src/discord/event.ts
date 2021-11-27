export abstract class Event<TContext = object> {
  // If you want to cancel registered event, change return value.
  public abstract register(listener: (props: TContext) => Promise<void>): void;
}
