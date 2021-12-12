import {
  AnyEvent,
  ContextOf,
  Event,
  EventContextBase,
  EventListener,
  EventOptionsBase,
  OptionsOf
} from "discord/events";
import { AnyEndpoint, Endpoint, EndpointParamsBase, EndpointResultBase, ParamsOf, ResultOf } from "endpoints";

export abstract class Action<
  TEventContext extends EventContextBase,
  TEventOption extends EventOptionsBase,
  TEndpointParams extends EndpointParamsBase,
  TEndpointResult extends EndpointResultBase
> implements EventListener<TEventContext, TEventOption>
{
  public readonly endpoint: Endpoint<TEndpointParams, TEndpointResult>;
  public readonly event: Event<TEventContext, TEventOption>;
  public abstract readonly options: TEventOption;

  protected constructor(
    endpoint: Endpoint<TEndpointParams, TEndpointResult>,
    event: Event<TEventContext, TEventOption>
  ) {
    this.event = event;
    this.endpoint = endpoint;
  }

  public activate() {
    this.event.register(this);
  }

  public abstract onEvent(context: TEventContext): Promise<void>;
}

export type EventContextOf<TAction extends AnyAction> = TAction extends Action<
  infer U,
  EventOptionsBase,
  EndpointParamsBase,
  EndpointResultBase
>
  ? U
  : never;

export type EventOptionsOf<TAction extends AnyAction> = TAction extends Action<
  EventContextBase,
  infer U,
  EndpointParamsBase,
  EndpointResultBase
>
  ? U
  : never;

export type EndpointParamsOf<TAction extends AnyAction> = TAction extends Action<
  EventContextBase,
  EventOptionsBase,
  infer U,
  EndpointResultBase
>
  ? U
  : never;

export type EndpointResultOf<TAction extends AnyAction> = TAction extends Action<
  EventContextBase,
  EventOptionsBase,
  EndpointParamsBase,
  infer U
>
  ? U
  : never;

export abstract class ActionWith<TEvent extends AnyEvent, TEndpoint extends AnyEndpoint> extends Action<
  ContextOf<TEvent>,
  OptionsOf<TEvent>,
  ParamsOf<TEndpoint>,
  ResultOf<TEndpoint>
> {}

export type AnyAction = Action<EventContextBase, EventOptionsBase, EndpointParamsBase, EndpointResultBase>;
