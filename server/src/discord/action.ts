import { Event } from "./event";

export abstract class Action<
  TEventContext extends object | void = void,
  TActionParams extends ActionBaseParams = ActionBaseParams,
  TActionResult extends object | void = void
> {
  private readonly event;
  protected listener?: ActionListener<TActionParams, TActionResult>;

  public constructor() {
    this.event = this.defineEvent();
    this.event.register((ctx) => this.onEvent(ctx));
  }

  public register(listener: ActionListener<TActionParams, TActionResult>) {
    this.listener = listener;
  }

  protected abstract defineEvent(): Event<TEventContext>;
  protected abstract onEvent(context: TEventContext): Promise<void>;
}

export type ActionBaseParams = {
  client: string;
};

export interface ActionListener<TActionParams extends ActionBaseParams, TActionResult> {
  onAction(params: TActionParams): Promise<TActionResult>;
}

export type ContextOf<TAction extends AnyAction> = TAction extends Action<infer U, ActionBaseParams, object | void>
  ? U
  : never;
export type ParamsOf<TAction extends AnyAction> = TAction extends Action<object | void, infer U, object | void>
  ? U
  : never;
export type ResultOf<TAction extends AnyAction> = TAction extends Action<object | void, ActionBaseParams, infer U>
  ? U
  : never;
export type ListenerOf<TAction extends AnyAction> = ActionListener<ParamsOf<TAction>, ResultOf<TAction>>;
export type EventOf<TAction extends AnyAction> = Event<ContextOf<TAction>>;
export type AnyAction = Action<object | void, ActionBaseParams, object | void>;
