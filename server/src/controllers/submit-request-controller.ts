import { Controller } from "~/controller";
import { ClientUser } from "~/models/context/client-user";
import { SubmitRequestParams, SubmitRequestAction } from "~/discord/actions/submit-request-action";

export class SubmitRequestController extends Controller<SubmitRequestAction> {
  requireUsersDiscordId = (ctx: SubmitRequestParams) => [ctx.client, ctx.target];

  async action(ctx: SubmitRequestParams, client: ClientUser) {
    const target = await client.services.users.getByDiscordId(ctx.target);
    if (!target) throw Error();

    const request = await target.submitRequest({ content: ctx.content });

    if (!request.index) throw Error();
    return {
      index: request.index
    };
  }
}
