export abstract class Event<TContext extends EventContextBase = object, TOptions extends EventOptionsBase = void> {
  protected listeners: EventListener<TContext, TOptions>[] = [];

  public abstract activate(): void;

  // If you want to cancel registered event, change return value into a function to unregister.
  public register(listener: EventListener<TContext, TOptions>) {
    this.listeners.push(listener);
  }
}

export interface EventListener<TContext extends EventContextBase = object, TOptions extends EventOptionsBase = void> {
  options: TOptions;
  onEvent(params: TContext): Promise<void>;
}

export type EventContextBase = object | void;
export type EventOptionsBase = object | void;
export type AnyEvent = Event<EventContextBase, EventOptionsBase>;
export type ContextOf<TEvent extends AnyEvent> = TEvent extends Event<infer U, EventOptionsBase> ? U : never;
export type OptionsOf<TEvent extends AnyEvent> = TEvent extends Event<EventContextBase, infer U> ? U : never;
export type ListenerOf<TEvent extends AnyEvent> = EventListener<ContextOf<TEvent>, OptionsOf<TEvent>>;
