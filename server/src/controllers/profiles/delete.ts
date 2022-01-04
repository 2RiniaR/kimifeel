import { ControllerFor, RunnerFor } from "../base";
import { ClientUser } from "models/structures";
import { NotFoundError } from "models/errors";
import {
  DeleteProfileEndpoint,
  DeleteProfileEndpointParams,
  DeleteProfileEndpointResult,
  NotFoundError as NotFoundEndPointError
} from "endpoints";

export class DeleteProfileRunner extends RunnerFor<DeleteProfileEndpoint> {
  generate(params: DeleteProfileEndpointParams, client: ClientUser): ControllerFor<DeleteProfileEndpoint> {
    return new DeleteProfileController(params, client);
  }
}

export class DeleteProfileController extends ControllerFor<DeleteProfileEndpoint> {
  async run(): Promise<DeleteProfileEndpointResult> {
    const profile = await this.client.profiles.findByIndex(this.context.index);

    if (!profile) {
      throw new NotFoundEndPointError();
    }

    try {
      await profile.delete();
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundEndPointError();
      }
      throw error;
    }

    return {
      index: profile.index,
      content: profile.content,
      authorUserId: profile.author.discordId,
      ownerUserId: profile.owner.discordId
    };
  }
}
