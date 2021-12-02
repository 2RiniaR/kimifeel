import { ControllerFor } from "controller";
import { NoPermissionActionError, RequestNotFoundActionError } from "discord/errors";
import { ClientUser } from "models/structures";
import { ForbiddenError } from "models/errors";
import { ChangeRequestEndpoint } from "../discord/endpoints";
import { ParamsOf, ResultOf } from "../discord/endpoint";

export class ChangeRequestController extends ControllerFor<ChangeRequestEndpoint> {
  requireUsersDiscordId = (ctx: ParamsOf<ChangeRequestEndpoint>) => [ctx.targetDiscordId];

  async action(ctx: ParamsOf<ChangeRequestEndpoint>, client: ClientUser): Promise<ResultOf<ChangeRequestEndpoint>> {
    const target = await client.users.getByDiscordId(ctx.targetDiscordId);
    if (!target) throw Error("The require user was not registered.");
    const request = await target.getRequestByIndex(ctx.index);
    if (!request) throw new RequestNotFoundActionError();

    try {
      const profile = await request.accept();
      const author = await client.users.fetch(profile.author);
      return {
        index: profile.index,
        content: profile.content,
        authorDiscordId: author.discordId
      };
    } catch (error) {
      if (error instanceof ForbiddenError) throw new NoPermissionActionError();
      else throw error;
    }
  }
}
