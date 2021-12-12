import { Endpoint, EndpointParamsBase, EndpointResultBase } from "endpoints";
import { EventContextBase } from "discord/events";
import { AnyAction, EndpointParamsOf, EndpointResultOf, EventContextOf } from "./base";

export abstract class Session<
  TEventContext extends EventContextBase,
  TEndpointParams extends EndpointParamsBase,
  TEndpointResult extends EndpointResultBase
> {
  public context: TEventContext;
  public endpoint: Endpoint<TEndpointParams, TEndpointResult>;

  public constructor(context: TEventContext, endpoint: Endpoint<TEndpointParams, TEndpointResult>) {
    this.context = context;
    this.endpoint = endpoint;
  }

  protected abstract fetch(): Promise<TEndpointParams>;
  protected abstract onSucceed(result: TEndpointResult): Promise<void>;
  protected abstract onFailed(error: unknown): Promise<void>;

  public async run(): Promise<void> {
    let result: TEndpointResult;
    try {
      const params = await this.fetch();
      result = await this.endpoint.invoke(params);
    } catch (error) {
      console.error(error);
      await this.onFailed(error);
      return;
    }

    try {
      await this.onSucceed(result);
    } catch (error) {
      console.error(error);
    }
  }
}

export abstract class SessionIn<TAction extends AnyAction> extends Session<
  EventContextOf<TAction>,
  EndpointParamsOf<TAction>,
  EndpointResultOf<TAction>
> {}
