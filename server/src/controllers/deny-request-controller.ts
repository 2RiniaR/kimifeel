import { Controller } from "~/controller";
import { ClientUser, ForbiddenError } from "~/models";
import * as Action from "~/discord/actions/deny-request-action";
import { DenyRequestParams, DenyRequestAction } from "~/discord/actions/deny-request-action";

export class DenyRequestController extends Controller<DenyRequestAction> {
  async action(ctx: DenyRequestParams, client: ClientUser) {
    const request = await client.requests.getByIndex(ctx.index);
    if (!request) throw new Action.RequestNotFoundError();

    try {
      await request.deny();
    } catch (error) {
      if (error instanceof ForbiddenError) throw new Action.ForbiddenError();
      else throw error;
    }
  }
}
