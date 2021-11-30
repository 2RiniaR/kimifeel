import { Controller } from "controller";
import { NoPermissionActionError, RequestNotFoundActionError } from "discord/errors";
import { DenyRequestAction, DenyRequestParams } from "discord/actions";
import { ForbiddenError } from "models/errors";
import { ClientUser } from "models/structures";

export class DenyRequestController extends Controller<DenyRequestAction> {
  async action(ctx: DenyRequestParams, client: ClientUser) {
    const request = await client.requests.getByIndex(ctx.index);
    if (!request) throw new RequestNotFoundActionError();

    try {
      await request.deny();
    } catch (error) {
      if (error instanceof ForbiddenError) throw new NoPermissionActionError();
      else throw error;
    }
  }
}
