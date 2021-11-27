import { Event } from "~/discord/event";

export abstract class Session<
  TEventContext extends object | void = void,
  TActionParams extends ActionBaseParams = ActionBaseParams,
  TActionResult extends object | void = void
> {
  public context: TEventContext;
  public listener: ActionListener<TActionParams, TActionResult>;
  public result!: TActionResult;

  public constructor(context: TEventContext, listener: ActionListener<TActionParams, TActionResult>) {
    this.context = context;
    this.listener = listener;
  }

  protected abstract fetchParams(): Promise<TActionParams | undefined>;
  protected abstract onSucceed(): Promise<void>;
  protected abstract onFailed(error: unknown): Promise<void>;

  public async run(): Promise<void> {
    const params = await this.fetchParams();
    if (!params) {
      await this.onFailed(Error());
      return;
    }

    try {
      this.result = await this.listener.onAction(params);
    } catch (error) {
      console.error(error);
      await this.onFailed(error);
      return;
    }

    await this.onSucceed();
  }
}

export type ActionBaseParams = {
  client: string;
};

export interface ActionListener<TActionParams extends ActionBaseParams, TActionResult> {
  onAction(params: TActionParams): Promise<TActionResult>;
}

export type ContextOf<TAction extends AnyAction> = TAction extends Session<infer U, ActionBaseParams, object | void>
  ? U
  : never;
export type ParamsOf<TAction extends AnyAction> = TAction extends Session<object | void, infer U, object | void>
  ? U
  : never;
export type ResultOf<TAction extends AnyAction> = TAction extends Session<object | void, ActionBaseParams, infer U>
  ? U
  : never;
export type ListenerOf<TAction extends AnyAction> = ActionListener<ParamsOf<TAction>, ResultOf<TAction>>;
export type EventOf<TAction extends AnyAction> = Event<ContextOf<TAction>>;
export type AnyAction = Session<object | void, ActionBaseParams, object | void>;
