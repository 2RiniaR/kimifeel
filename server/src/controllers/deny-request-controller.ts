import { Controller } from "~/controller";
import { ClientUser } from "~/models/context/client-user";
import { DenyRequestSession, DenyRequestParams } from "~/discord/actions/deny-request-action";

export class DenyRequestController extends Controller<DenyRequestSession> {
  requireUsersDiscordId = (ctx: DenyRequestParams) => [ctx.client];

  async action(ctx: DenyRequestParams, client: ClientUser) {
    const request = await client.services.requests.getByIndex(ctx.index);
    if (!request) throw Error();
    await request.deny();
  }
}
