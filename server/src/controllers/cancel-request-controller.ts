import { Controller } from "~/controller";
import { ClientUser } from "~/models/context/client-user";
import { NotFoundError } from "~/models/errors/not-found-error";
import { CancelRequestAction, CancelRequestParams } from "~/discord/actions/cancel-request-action";

export class CancelRequestController extends Controller<CancelRequestAction> {
  requireUsersDiscordId = (ctx: CancelRequestParams) => [ctx.client];

  async action(ctx: CancelRequestParams, client: ClientUser) {
    const request = await client.services.requests.getByIndex(ctx.index);
    if (!request) throw new NotFoundError();
    await request.cancel();
  }
}
