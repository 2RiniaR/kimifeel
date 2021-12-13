import { ControllerFor } from "./base";
import { ClientUser } from "models/structures";
import { ForbiddenError } from "models/errors";
import { CancelRequestEndpoint, CancelRequestEndpointParams, CancelRequestEndpointResult } from "endpoints";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";

export class CancelRequestController extends ControllerFor<CancelRequestEndpoint> {
  requireUsersDiscordId = (ctx: CancelRequestEndpointParams) => [ctx.targetDiscordId];

  async action(ctx: CancelRequestEndpointParams, client: ClientUser): Promise<CancelRequestEndpointResult> {
    const target = await client.users.findByDiscordId(ctx.targetDiscordId);
    if (!target) throw Error("The require user was not registered.");
    const request = await target.getRequestByIndex(ctx.index);
    if (!request) throw new RequestNotFoundEndpointError();

    try {
      await request.cancel();
      return {
        index: request.index,
        content: request.profile.content,
        requesterUserId: client.asUser().discordId,
        targetUserId: target.discordId
      };
    } catch (error) {
      if (error instanceof ForbiddenError) throw new NoPermissionEndpointError();
      else throw error;
    }
  }
}
