import { Controller } from "~/controller";
import { ClientUser } from "~/models/context/client-user";
import { CancelRequestParams, CancelRequestAction } from "~/discord/actions/cancel-request-action";

export class CancelRequestController extends Controller<CancelRequestAction> {
  async action(ctx: CancelRequestParams, client: ClientUser) {
    const request = await client.requests.getByIndex(ctx.index);
    if (!request) throw Error();
    await request.cancel();
  }
}
