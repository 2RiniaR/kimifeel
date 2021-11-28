import { Controller } from "~/controller";
import { ClientUser, ForbiddenError } from "~/models";
import * as Action from "~/discord/actions/cancel-request-action";
import { CancelRequestParams, CancelRequestAction } from "~/discord/actions/cancel-request-action";

export class CancelRequestController extends Controller<CancelRequestAction> {
  async action(ctx: CancelRequestParams, client: ClientUser) {
    const request = await client.requests.getByIndex(ctx.index);
    if (!request) throw new Action.RequestNotFoundError();

    try {
      await request.cancel();
    } catch (error) {
      if (error instanceof ForbiddenError) throw new Action.ForbiddenError();
      else throw error;
    }
  }
}
