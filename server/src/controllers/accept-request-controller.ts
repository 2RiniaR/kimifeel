import { Controller } from "controller";
import { AcceptRequestAction, AcceptRequestParams } from "discord/actions";
import { NoPermissionActionError, RequestNotFoundActionError } from "discord/errors";
import { ClientUser } from "models/structures";
import { ForbiddenError } from "models/errors";

export class AcceptRequestController extends Controller<AcceptRequestAction> {
  async action(ctx: AcceptRequestParams, client: ClientUser) {
    const request = await client.requests.getByIndex(ctx.index);
    if (!request) throw new RequestNotFoundActionError();

    try {
      await request.accept();
    } catch (error) {
      if (error instanceof ForbiddenError) throw new NoPermissionActionError();
      else throw error;
    }
  }
}
