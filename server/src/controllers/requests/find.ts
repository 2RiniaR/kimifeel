import { ControllerFor, RunnerFor } from "../base";
import { ClientUser } from "models/structures";
import { FindRequestEndpoint, FindRequestEndpointParams } from "endpoints";

export class FindRequestRunner extends RunnerFor<FindRequestEndpoint> {
  generate(params: FindRequestEndpointParams, client: ClientUser): ControllerFor<FindRequestEndpoint> {
    return new FindRequestController(params, client);
  }
}

export class FindRequestController extends ControllerFor<FindRequestEndpoint> {
  async run() {
    const request = await this.client.requests.findByIndex(this.context.index);
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
