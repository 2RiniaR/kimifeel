import { ControllerFor } from "./base";
import { ClientUser } from "models/structures";
import { ForbiddenError } from "models/errors";
import { AcceptRequestEndpoint, AcceptRequestEndpointParams, AcceptRequestEndpointResult } from "endpoints";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";

export class AcceptRequestController extends ControllerFor<AcceptRequestEndpoint> {
  async action(ctx: AcceptRequestEndpointParams, client: ClientUser): Promise<AcceptRequestEndpointResult> {
    const request = await client.asUser().getRequestByIndex(ctx.index);
    if (!request) throw new RequestNotFoundEndpointError();

    try {
      const profile = await request.accept();
      const author = await client.users.fetch(profile.author);
      return {
        index: profile.index,
        content: profile.content,
        authorUserId: author.discordId,
        ownerUserId: client.asUser().discordId
      };
    } catch (error) {
      if (error instanceof ForbiddenError) throw new NoPermissionEndpointError();
      else throw error;
    }
  }
}
