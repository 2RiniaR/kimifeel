import { ControllerFor, RunnerFor } from "../base";
import { ContentLengthLimitError } from "models/errors";
import { ClientUser } from "models/structures";
import { CreateRequestEndpoint, CreateRequestEndpointParams } from "endpoints";
import { ProfileContentLengthLimitEndpointError } from "endpoints/errors";

export class CreateRequestRunner extends RunnerFor<CreateRequestEndpoint> {
  generate(params: CreateRequestEndpointParams, client: ClientUser): ControllerFor<CreateRequestEndpoint> {
    return new CreateRequestController(params, client);
  }
}

export class CreateRequestController extends ControllerFor<CreateRequestEndpoint> {
  async run() {
    const target = await this.client.users.findByDiscordId(this.context.targetDiscordId);
    if (!target) {
      throw Error();
    }

    try {
      const request = await target.submitRequest(this.context.content);
      return {
        index: request.index,
        content: request.profile.content,
        requesterUserId: request.profile.author.discordId,
        targetUserId: request.profile.owner.discordId
      };
    } catch (error) {
      if (error instanceof ContentLengthLimitError) {
        throw new ProfileContentLengthLimitEndpointError(error.min, error.max, error.actual);
      } else {
        throw error;
      }
    }
  }
}
