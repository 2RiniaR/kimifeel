import { Controller } from "controller";
import { NoPermissionActionError, RequestNotFoundActionError } from "discord/errors";
import { DenyRequestAction, DenyRequestParams } from "discord/actions";
import { ForbiddenError } from "models/errors";
import { ClientUser } from "models/structures";

export class DenyRequestController extends Controller<DenyRequestAction> {
  requireUsersDiscordId = (ctx: DenyRequestParams) => [ctx.target];

  async action(ctx: DenyRequestParams, client: ClientUser) {
    const target = await client.users.getByDiscordId(ctx.target);
    if (!target) throw Error("The require user was not registered.");
    const request = await target.getRequestByIndex(ctx.index);
    if (!request) throw new RequestNotFoundActionError();

    try {
      await request.deny();
    } catch (error) {
      if (error instanceof ForbiddenError) throw new NoPermissionActionError();
      else throw error;
    }
  }
}
