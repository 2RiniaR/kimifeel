import { ControllerFor } from "../base";
import { ClientUser } from "models/structures";
import { ForbiddenError } from "models/errors";
import { CancelRequestEndpoint, CancelRequestEndpointParams, CancelRequestEndpointResult } from "endpoints";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";

export class CancelRequestController extends ControllerFor<CancelRequestEndpoint> {
  async action(ctx: CancelRequestEndpointParams, client: ClientUser): Promise<CancelRequestEndpointResult> {
    const request = await client.requests.findByIndex(ctx.index);
    if (!request) {
      throw new RequestNotFoundEndpointError();
    }

    try {
      await request.cancel();
      return {
        index: request.index,
        content: request.profile.content,
        requesterUserId: request.profile.author.discordId,
        targetUserId: request.profile.owner.discordId
      };
    } catch (error) {
      if (error instanceof ForbiddenError) throw new NoPermissionEndpointError();
      else throw error;
    }
  }
}
