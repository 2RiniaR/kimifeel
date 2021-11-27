import { Controller } from "~/controller";
import { ClientUser } from "~/models/context/client-user";
import { DenyRequestParams, DenyRequestAction } from "~/discord/actions/deny-request-action";

export class DenyRequestController extends Controller<DenyRequestAction> {
  requireUsersDiscordId = (ctx: DenyRequestParams) => [ctx.client];

  async action(ctx: DenyRequestParams, client: ClientUser) {
    const request = await client.services.requests.getByIndex(ctx.index);
    if (!request) throw Error();
    await request.deny();
  }
}
