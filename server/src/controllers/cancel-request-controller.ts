import { Controller } from "controller";
import { CancelRequestAction, CancelRequestParams } from "discord/actions";
import { NoPermissionActionError, RequestNotFoundActionError } from "discord/errors";
import { ClientUser } from "models/structures";
import { ForbiddenError } from "models/errors";

export class CancelRequestController extends Controller<CancelRequestAction> {
  requireUsersDiscordId = (ctx: CancelRequestParams) => [ctx.target];

  async action(ctx: CancelRequestParams, client: ClientUser) {
    const target = await client.users.getByDiscordId(ctx.target);
    if (!target) throw Error("The require user was not registered.");
    const request = await target.getRequestByIndex(ctx.index);
    if (!request) throw new RequestNotFoundActionError();

    try {
      await request.cancel();
    } catch (error) {
      if (error instanceof ForbiddenError) throw new NoPermissionActionError();
      else throw error;
    }
  }
}
