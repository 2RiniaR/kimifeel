import { Controller } from "controller";
import { ProfileContentLengthLimitActionError } from "discord/errors";
import { SubmitRequestAction, SubmitRequestParams } from "discord/actions";
import { ContentLengthLimitError } from "models/errors";
import { ClientUser } from "models/structures";

export class CreateRequestController extends Controller<SubmitRequestAction> {
  requireUsersDiscordId = (ctx: SubmitRequestParams) => [ctx.target];

  async action(ctx: SubmitRequestParams, client: ClientUser) {
    const target = await client.users.getByDiscordId(ctx.target);
    if (!target) throw Error();

    try {
      const request = await target.submitRequest(ctx.content);
      return { index: request.index };
    } catch (error) {
      if (error instanceof ContentLengthLimitError) {
        throw new ProfileContentLengthLimitActionError(error.min, error.max, error.actual);
      } else {
        throw error;
      }
    }
  }
}
