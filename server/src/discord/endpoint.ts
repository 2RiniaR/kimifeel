import { Event } from "./event";

export abstract class Query<
  TEventContext extends object | void = void,
  TQueryParams extends QueryBaseParams = QueryBaseParams,
  TQueryResult extends object | void = void
> {
  private readonly event;
  protected listener?: QueryListener<TQueryParams, TQueryResult>;

  public constructor() {
    this.event = this.defineEvent();
    this.event.register((ctx) => this.onEvent(ctx));
  }

  public register(listener: QueryListener<TQueryParams, TQueryResult>) {
    this.listener = listener;
  }

  protected abstract defineEvent(): Event<TEventContext>;
  protected abstract onEvent(context: TEventContext): Promise<void>;
}

export type QueryBaseParams = {
  client: string;
};

export interface QueryListener<TQueryParams extends QueryBaseParams, TQueryResult> {
  runQuery(params: TQueryParams): Promise<TQueryResult>;
}

export type ContextOf<TQuery extends AnyQuery> = TQuery extends Query<infer U, QueryBaseParams, object | void>
  ? U
  : never;
export type ParamsOf<TQuery extends AnyQuery> = TQuery extends Query<object | void, infer U, object | void> ? U : never;
export type ResultOf<TQuery extends AnyQuery> = TQuery extends Query<object | void, QueryBaseParams, infer U>
  ? U
  : never;
export type ListenerOf<TQuery extends AnyQuery> = QueryListener<ParamsOf<TQuery>, ResultOf<TQuery>>;
export type EventOf<TQuery extends AnyQuery> = Event<ContextOf<TQuery>>;
export type AnyQuery = Query<object | void, QueryBaseParams, object | void>;
