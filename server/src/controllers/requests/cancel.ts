import { ControllerFor, RunnerFor } from "../base";
import { ClientUser } from "models/structures";
import { ForbiddenError } from "models/errors";
import { CancelRequestEndpoint, CancelRequestEndpointParams } from "endpoints";
import { NoPermissionEndpointError, RequestNotFoundEndpointError } from "endpoints/errors";

export class CancelRequestRunner extends RunnerFor<CancelRequestEndpoint> {
  generate(params: CancelRequestEndpointParams, client: ClientUser): ControllerFor<CancelRequestEndpoint> {
    return new CancelRequestController(params, client);
  }
}

export class CancelRequestController extends ControllerFor<CancelRequestEndpoint> {
  async run() {
    const request = await this.client.requests.findByIndex(this.context.index);
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
