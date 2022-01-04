import { ControllerFor, RunnerFor } from "../base";
import { ClientUser } from "models/structures";
import { ForbiddenError } from "models/errors";
import { DenyRequestEndpoint, DenyRequestEndpointParams } from "endpoints";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";

export class DenyRequestRunner extends RunnerFor<DenyRequestEndpoint> {
  generate(params: DenyRequestEndpointParams, client: ClientUser): ControllerFor<DenyRequestEndpoint> {
    return new DenyRequestController(params, client);
  }
}

export class DenyRequestController extends ControllerFor<DenyRequestEndpoint> {
  async run() {
    const request = await this.client.requests.findByIndex(this.context.index);
    if (!request) {
      throw new RequestNotFoundEndpointError();
    }

    try {
      await request.deny();
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
