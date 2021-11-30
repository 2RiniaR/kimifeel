import { Controller } from "controller";
import { AcceptRequestAction, AcceptRequestParams, AcceptRequestResult } from "discord/actions";
import { NoPermissionActionError, RequestNotFoundActionError } from "discord/errors";
import { ClientUser } from "models/structures";
import { ForbiddenError } from "models/errors";

export class AcceptRequestController extends Controller<AcceptRequestAction> {
  requireUsersDiscordId = (ctx: AcceptRequestParams) => [ctx.target];

  async action(ctx: AcceptRequestParams, client: ClientUser): Promise<AcceptRequestResult> {
    const target = await client.users.getByDiscordId(ctx.target);
    if (!target) throw Error("The require user was not registered.");
    const request = await target.getRequestByIndex(ctx.index);
    if (!request) throw new RequestNotFoundActionError();

    try {
      const profile = await request.accept();
      const author = await client.users.fetch(profile.author);
      return {
        index: profile.index,
        content: profile.content,
        author: author.discordId
      };
    } catch (error) {
      if (error instanceof ForbiddenError) throw new NoPermissionActionError();
      else throw error;
    }
  }
}
