export class Endpoint<
  TEndpointParams extends EndpointParamsBase = EndpointParamsBase,
  TEndpointResult extends EndpointResultBase = void
> {
  public listener?: EndpointListener<TEndpointParams, TEndpointResult>;

  public listen(listener: EndpointListener<TEndpointParams, TEndpointResult>) {
    this.listener = listener;
  }

  public invoke(params: TEndpointParams): Promise<TEndpointResult> {
    if (!this.listener) throw Error("The endpoint has no listener.");
    return this.listener.runEndpoint(params);
  }
}

export type EndpointParamsBase = {
  clientDiscordId: string;
};
export type EndpointResultBase = object | void;

export interface EndpointListener<TEndpointParams extends EndpointParamsBase, TEndpointResult> {
  runEndpoint(params: TEndpointParams): Promise<TEndpointResult>;
}

export type ParamsOf<TEndpoint extends AnyEndpoint> = TEndpoint extends Endpoint<infer U, EndpointResultBase>
  ? U
  : never;

export type ResultOf<TEndpoint extends AnyEndpoint> = TEndpoint extends Endpoint<EndpointParamsBase, infer U>
  ? U
  : never;

export type ListenerOf<TEndpoint extends AnyEndpoint> = EndpointListener<ParamsOf<TEndpoint>, ResultOf<TEndpoint>>;
export type AnyEndpoint = Endpoint<EndpointParamsBase, EndpointResultBase>;
