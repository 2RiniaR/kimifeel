import { ClientUser } from "~/models/context/client-user";
import { ClientUserService } from "~/models/services/client-user-service";
import { NotFoundError } from "~/models/errors/not-found-error";
import { AnyAction, ListenerOf, ParamsOf, ResultOf } from "~/discord/action";

export abstract class Controller<TAction extends AnyAction> implements ListenerOf<TAction> {
  private service = new ClientUserService();

  public abstract requireUsersDiscordId(ctx: ParamsOf<TAction>): string[];
  public abstract action(ctx: ParamsOf<TAction>, client: ClientUser): Promise<ResultOf<TAction>>;

  private async checkRegisterUsers(usersDiscordId: string[]) {
    console.log("checkRegisterUsers-1");
    await Promise.all(usersDiscordId.map((id) => this.service.registerIfNotExist(id)));
  }

  public async onAction(params: ParamsOf<TAction>): Promise<ResultOf<TAction>> {
    console.log("controller-base-1");
    await this.checkRegisterUsers(this.requireUsersDiscordId(params));
    console.log("controller-base-2");
    const client = await this.service.getByDiscordId(params.client);
    console.log("controller-base-3");
    if (!client) throw new NotFoundError();
    console.log("controller-base-4");
    return await this.action(params, client);
  }
}
