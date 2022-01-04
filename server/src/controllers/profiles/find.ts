import { ControllerFor, RunnerFor } from "../base";
import { ClientUser } from "models/structures";
import {
  FindProfileEndpoint,
  FindProfileEndpointParams,
  FindProfileEndpointResult,
  NotFoundError as NotFoundEndPointError
} from "endpoints";

export class FindProfileRunner extends RunnerFor<FindProfileEndpoint> {
  generate(params: FindProfileEndpointParams, client: ClientUser): ControllerFor<FindProfileEndpoint> {
    return new FindProfileController(params, client);
  }
}

export class FindProfileController extends ControllerFor<FindProfileEndpoint> {
  async run(): Promise<FindProfileEndpointResult> {
    const profile = await this.client.profiles.findByIndex(this.context.index);

    if (!profile) {
      throw new NotFoundEndPointError();
    }

    return {
      ownerUserId: profile.owner.discordId,
      authorUserId: profile.author.discordId,
      content: profile.content,
      index: profile.index
    };
  }
}
