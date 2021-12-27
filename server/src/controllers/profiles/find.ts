import { ControllerFor } from "../base";
import { ClientUser } from "models/structures";
import { FindProfilesEndpoint, FindProfileEndpointParams, FindProfilesEndpointResult } from "endpoints";

export class FindProfilesController extends ControllerFor<FindProfilesEndpoint> {
  async action(ctx: FindProfileEndpointParams, client: ClientUser): Promise<FindProfilesEndpointResult> {
    const profile = await client.profiles.findByIndex(ctx.index);
    if (!profile) {
      throw Error();
    }

    return {
      ownerUserId: profile.owner.discordId,
      authorUserId: profile.author.discordId,
      content: profile.content,
      index: profile.index
    };
  }
}
