import { Controller } from "~/controller";
import { ClientUser, ForbiddenError } from "~/models";
import * as Action from "~/discord/actions/accept-request-action";
import { AcceptRequestParams, AcceptRequestAction } from "~/discord/actions/accept-request-action";

export class AcceptRequestController extends Controller<AcceptRequestAction> {
  async action(ctx: AcceptRequestParams, client: ClientUser) {
    const request = await client.requests.getByIndex(ctx.index);
    if (!request) throw new Action.RequestNotFoundError();

    try {
      await request.accept();
    } catch (error) {
      if (error instanceof ForbiddenError) throw new Action.ForbiddenError();
      else throw error;
    }
  }
}
