import { ControllerFor } from "controllers/controller";
import { ClientUser } from "models/structures";
import { GetProfilesEndpoint, GetProfilesEndpointParams, GetProfilesEndpointResult } from "endpoints";

export class GetProfilesController extends ControllerFor<GetProfilesEndpoint> {
  requireUsersDiscordId = (ctx: GetProfilesEndpointParams) => {
    const users: string[] = [];
    if ("authorDiscordId" in ctx && ctx.authorDiscordId) users.push(ctx.authorDiscordId);
    if ("ownerDiscordId" in ctx && ctx.ownerDiscordId) users.push(ctx.ownerDiscordId);
    return users;
  };

  async action(ctx: GetProfilesEndpointParams, client: ClientUser): Promise<GetProfilesEndpointResult> {
    const target = await client.users.findByDiscordId(ctx.ownerDiscordId);
    if (!target) throw Error();

    const profiles = await client.profiles.search({
      author: ctx.ownerDiscordId ? await client.users.findByDiscordId(ctx.ownerDiscordId) : undefined,
      range: {
        start: ctx.
      }
    });
    return await profiles.mapAsync(async (profile) => {
      const author = await client.users.fetch(profile.author);
      return {
        authorUserId: author.discordId,
        content: profile.content,
        index: profile.index
      };
    });
  }
}
