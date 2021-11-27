import { Controller } from "~/controller";
import { ClientUser } from "~/models/context/client-user";
import { NotFoundError } from "~/models/errors/not-found-error";
import { DenyRequestAction, DenyRequestParams } from "~/discord/actions/deny-request-action";

export class DenyRequestController extends Controller<DenyRequestAction> {
  requireUsersDiscordId = (ctx: DenyRequestParams) => [ctx.client];

  async action(ctx: DenyRequestParams, client: ClientUser) {
    const request = await client.services.requests.getByIndex(ctx.index);
    if (!request) throw new NotFoundError();
    await request.deny();
  }
}
