import { AnyAction, ListenerOf, ParamsOf, ResultOf } from "./discord/action";
import { ClientUserManager } from "./models/managers/client-user-manager";
import { ClientUser } from "./models/structures";

export abstract class Controller<TAction extends AnyAction> implements ListenerOf<TAction> {
  private service = new ClientUserManager();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public requireUsersDiscordId(_: Omit<ParamsOf<TAction>, "client">): string[] {
    return [];
  }

  public abstract action(ctx: ParamsOf<TAction>, client: ClientUser): Promise<ResultOf<TAction>>;

  private async checkRequireUsers(params: ParamsOf<TAction>) {
    const users = this.requireUsersDiscordId(params);
    await Promise.all(users.map((id) => this.service.registerIfNotExist(id)));
  }

  public async onAction(params: ParamsOf<TAction>): Promise<ResultOf<TAction>> {
    await this.checkRequireUsers(params);
    const client = await this.service.registerIfNotExist(params.client);
    return await this.action(params, client);
  }
}
