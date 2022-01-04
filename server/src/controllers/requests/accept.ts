import { ControllerFor, RunnerFor } from "../base";
import { ClientUser } from "models/structures";
import { ForbiddenError } from "models/errors";
import { AcceptRequestEndpoint, AcceptRequestEndpointParams } from "endpoints";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";

export class AcceptRequestRunner extends RunnerFor<AcceptRequestEndpoint> {
  generate(params: AcceptRequestEndpointParams, client: ClientUser): ControllerFor<AcceptRequestEndpoint> {
    return new AcceptRequestController(params, client);
  }
}

export class AcceptRequestController extends ControllerFor<AcceptRequestEndpoint> {
  async run() {
    const request = await this.client.requests.findByIndex(this.context.index);
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
