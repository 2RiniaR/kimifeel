import { ControllerFor } from "../base";
import { ContentLengthLimitError } from "models/errors";
import { ClientUser } from "models/structures";
import { CreateRequestEndpoint, CreateRequestEndpointParams, CreateRequestEndpointResult } from "endpoints";
import { ProfileContentLengthLimitEndpointError } from "endpoints/errors";

export class CreateRequestController extends ControllerFor<CreateRequestEndpoint> {
  async action(ctx: CreateRequestEndpointParams, client: ClientUser): Promise<CreateRequestEndpointResult> {
    const target = await client.users.findByDiscordId(ctx.targetDiscordId);
    if (!target) {
      throw Error();
    }

    try {
      const request = await target.submitRequest(ctx.content);
      return {
        index: request.index,
        content: request.profile.content,
        requesterUserId: request.profile.author.discordId,
        targetUserId: request.target.discordId
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
