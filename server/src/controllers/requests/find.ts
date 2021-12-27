import { ControllerFor } from "../base";
import { ClientUser } from "models/structures";
import { FindRequestEndpoint, FindRequestEndpointParams, FindRequestEndpointResult } from "endpoints";

export class FindRequestController extends ControllerFor<FindRequestEndpoint> {
  async action(ctx: FindRequestEndpointParams, client: ClientUser): Promise<FindRequestEndpointResult> {
    const request = await client.requests.findByIndex(ctx.index);
    if (!request) {
      throw Error();
    }

    return {
      targetUserId: request.profile.owner.discordId,
      requesterUserId: request.profile.author.discordId,
      content: request.profile.content,
      index: request.index
    };
  }
}
