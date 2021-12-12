import { ControllerFor } from "./base";
import { ClientUser } from "models/structures";
import { ForbiddenError } from "models/errors";
import { ChangeRequestEndpoint, ChangeRequestEndpointParams, ChangeRequestEndpointResult } from "endpoints";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";

export class ChangeRequestController extends ControllerFor<ChangeRequestEndpoint> {
  requireUsersDiscordId = (ctx: ChangeRequestEndpointParams) => [ctx.targetDiscordId];

  async action(ctx: ChangeRequestEndpointParams, client: ClientUser): Promise<ChangeRequestEndpointResult> {
    const target = await client.users.findByDiscordId(ctx.targetDiscordId);
    if (!target) throw Error("The require user was not registered.");
    const request = await target.getRequestByIndex(ctx.index);
    if (!request) throw new RequestNotFoundEndpointError();

    try {
      const profile = await request.accept();
      const author = await client.users.fetch(profile.author);
      return {
        index: profile.index,
        content: profile.content,
        authorDiscordId: author.discordId
      };
    } catch (error) {
      if (error instanceof ForbiddenError) throw new NoPermissionEndpointError();
      else throw error;
    }
  }
}
