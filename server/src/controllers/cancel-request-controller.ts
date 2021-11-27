import { Controller } from "~/controller";
import { ClientUser } from "~/models/context/client-user";
import { CancelRequestSession, CancelRequestParams } from "~/discord/actions/cancel-request-action";

export class CancelRequestController extends Controller<CancelRequestSession> {
  requireUsersDiscordId = (ctx: CancelRequestParams) => [ctx.client];

  async action(ctx: CancelRequestParams, client: ClientUser) {
    const request = await client.services.requests.getByIndex(ctx.index);
    if (!request) throw Error();
    await request.cancel();
  }
}
