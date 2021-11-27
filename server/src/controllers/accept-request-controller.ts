import { ClientUser } from "~/models/context/client-user";
import { ForbiddenError } from "~/models/errors/forbidden-error";
import { AcceptRequestSession, AcceptRequestParams } from "~/discord/actions/accept-request-action";
import { Controller } from "~/controller";

export class AcceptRequestController extends Controller<AcceptRequestSession> {
  requireUsersDiscordId = (ctx: AcceptRequestParams) => [ctx.client];

  async action(ctx: AcceptRequestParams, client: ClientUser) {
    const request = await client.services.requests.getByIndex(ctx.index);
    if (!request) throw Error();

    try {
      await request.accept();
    } catch (error) {
      if (error instanceof ForbiddenError) throw new Error();
      else throw error;
    }
  }
}
