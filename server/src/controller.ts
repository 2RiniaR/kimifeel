import {
  AnyEndpoint,
  EndpointListener,
  EndpointParamsBase,
  EndpointResultBase,
  ParamsOf,
  ResultOf
} from "./endpoint";
import { ClientUserManager } from "./models/managers/client-user-manager";
import { ClientUser } from "./models/structures";

export abstract class Controller<TEndpointParams extends EndpointParamsBase, TEndpointResult extends EndpointResultBase>
  implements EndpointListener<TEndpointParams, TEndpointResult>
{
  private service = new ClientUserManager();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public requireUsersDiscordId(_: Omit<TEndpointParams, "client">): string[] {
    return [];
  }

  public abstract action(ctx: TEndpointParams, client: ClientUser): Promise<TEndpointResult>;

  private async checkRequireUsers(params: TEndpointParams) {
    const users = this.requireUsersDiscordId(params);
    await Promise.all(users.map((id) => this.service.registerIfNotExist(id)));
  }

  public async runEndpoint(params: TEndpointParams): Promise<TEndpointResult> {
    await this.checkRequireUsers(params);
    const client = await this.service.registerIfNotExist(params.clientDiscordId);
    return await this.action(params, client);
  }
}

export abstract class ControllerFor<TEndpoint extends AnyEndpoint> extends Controller<
  ParamsOf<TEndpoint>,
  ResultOf<TEndpoint>
> {}
