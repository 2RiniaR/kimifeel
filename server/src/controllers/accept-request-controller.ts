import { ClientUser } from "~/models/context/client-user";
import { ForbiddenError } from "~/models/errors/forbidden-error";
import { AcceptRequestAction, NotFoundError, AcceptRequestParams } from "~/discord/actions/accept-request-action";
import { Controller } from "~/controller";

export class AcceptRequestController extends Controller<AcceptRequestAction> {
  requireUsersDiscordId = (ctx: AcceptRequestParams) => [ctx.client];

  async action(ctx: AcceptRequestParams, client: ClientUser) {
    const request = await client.services.requests.getByIndex(ctx.index);
    if (!request) throw new NotFoundError("リクエストが見つかりませんでした。");

    try {
      await request.accept();
    } catch (error) {
      if (error instanceof ForbiddenError) throw new ForbiddenError("");
    }
  }
}
