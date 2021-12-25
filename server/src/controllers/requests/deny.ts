import { ControllerFor } from "../base";
import { ClientUser } from "models/structures";
import { ForbiddenError } from "models/errors";
import { DenyRequestEndpoint, DenyRequestEndpointParams, DenyRequestEndpointResult } from "endpoints";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";

export class DenyRequestController extends ControllerFor<DenyRequestEndpoint> {
  async action(ctx: DenyRequestEndpointParams, client: ClientUser): Promise<DenyRequestEndpointResult> {
    const request = await client.asUser().getRequestByIndex(ctx.index);
    if (!request) {
      throw new RequestNotFoundEndpointError();
    }

    try {
      await request.deny();
      return {
        index: request.index,
        content: request.profile.content,
        requesterUserId: request.profile.author.discordId,
        targetUserId: request.target.discordId
      };
    } catch (error) {
      if (error instanceof ForbiddenError) throw new NoPermissionEndpointError();
      else throw error;
    }
  }
}
