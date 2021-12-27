import { ControllerFor } from "../base";
import { ClientUser } from "models/structures";
import { ForbiddenError } from "models/errors";
import { AcceptRequestEndpoint, AcceptRequestEndpointParams, AcceptRequestEndpointResult } from "endpoints";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";

export class AcceptRequestController extends ControllerFor<AcceptRequestEndpoint> {
  async action(ctx: AcceptRequestEndpointParams, client: ClientUser): Promise<AcceptRequestEndpointResult> {
    const request = await client.requests.findByIndex(ctx.index);
    if (!request) {
      throw new RequestNotFoundEndpointError();
    }

    try {
      const profile = await request.accept();
      return {
        index: profile.index,
        content: profile.content,
        authorUserId: profile.author.discordId,
        ownerUserId: profile.owner.discordId
      };
    } catch (error) {
      if (error instanceof ForbiddenError) throw new NoPermissionEndpointError();
      else throw error;
    }
  }
}
