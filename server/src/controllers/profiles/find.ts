import { ControllerFor } from "../base";
import { ClientUser } from "models/structures";
import { FindProfilesEndpoint, FindProfileEndpointParams, FindProfilesEndpointResult } from "endpoints";

export class FindProfilesController extends ControllerFor<FindProfilesEndpoint> {
  async action(ctx: FindProfileEndpointParams, client: ClientUser): Promise<FindProfilesEndpointResult> {
    const owner = await client.users.findByDiscordId(ctx.ownerDiscordId);
    if (!owner) {
      throw Error();
    }

    const profile = await owner.getProfileByIndex(ctx.index);
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
