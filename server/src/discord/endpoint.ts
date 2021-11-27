import { AnyAction, ContextOf, EventOf, ListenerOf } from "~/discord/action";

export abstract class Endpoint<TAction extends AnyAction> {
  private readonly event;
  protected listener?: ListenerOf<TAction>;

  public constructor() {
    this.event = this.defineEvent();
    this.event.register((ctx) => this.onEvent(ctx));
  }

  public register(listener: ListenerOf<TAction>) {
    this.listener = listener;
  }

  protected abstract defineEvent(): EventOf<TAction>;
  protected abstract onEvent(context: ContextOf<TAction>): Promise<void>;
}
