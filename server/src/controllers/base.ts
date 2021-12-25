import { AnyEndpoint, EndpointListener, EndpointParamsBase, EndpointResultBase, ParamsOf, ResultOf } from "endpoints";
import { ClientUserManager } from "models/managers";
import { ClientUser } from "../models/structures";

export abstract class Controller<TEndpointParams extends EndpointParamsBase, TEndpointResult extends EndpointResultBase>
  implements EndpointListener<TEndpointParams, TEndpointResult>
{
  private service = new ClientUserManager();

  public abstract action(ctx: TEndpointParams, client: ClientUser): Promise<TEndpointResult>;

  public async runEndpoint(params: TEndpointParams): Promise<TEndpointResult> {
    const client = await this.service.findByDiscordId(params.clientDiscordId);
    if (!client) {
      throw new Error("User was not registered.");
    }
    return await this.action(params, client);
  }
}

export abstract class ControllerFor<TEndpoint extends AnyEndpoint> extends Controller<
  ParamsOf<TEndpoint>,
  ResultOf<TEndpoint>
> {}
