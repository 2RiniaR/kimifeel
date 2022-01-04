import { AnyEndpoint, EndpointListener, EndpointParamsBase, EndpointResultBase, ParamsOf, ResultOf } from "endpoints";
import { ClientUserManager } from "models/managers";
import { ClientUser } from "../models/structures";

export abstract class Runner<TEndpointParams extends EndpointParamsBase, TEndpointResult extends EndpointResultBase>
  implements EndpointListener<TEndpointParams, TEndpointResult>
{
  public abstract generate(params: TEndpointParams, client: ClientUser): Controller<TEndpointParams, TEndpointResult>;

  public async runEndpoint(params: TEndpointParams): Promise<TEndpointResult> {
    const service = new ClientUserManager();
    const client = await service.findByDiscordId(params.clientDiscordId);
    if (!client) {
      throw new Error("User was not registered.");
    }
    const controller = this.generate(params, client);
    return await controller.run();
  }
}

export abstract class RunnerFor<TEndpoint extends AnyEndpoint> extends Runner<
  ParamsOf<TEndpoint>,
  ResultOf<TEndpoint>
> {}

export abstract class Controller<
  TEndpointParams extends EndpointParamsBase,
  TEndpointResult extends EndpointResultBase
> {
  public readonly context: TEndpointParams;
  public readonly client: ClientUser;

  public constructor(context: TEndpointParams, client: ClientUser) {
    this.context = context;
    this.client = client;
  }

  public abstract run(): Promise<TEndpointResult>;
}

export abstract class ControllerFor<TEndpoint extends AnyEndpoint> extends Controller<
  ParamsOf<TEndpoint>,
  ResultOf<TEndpoint>
> {}
