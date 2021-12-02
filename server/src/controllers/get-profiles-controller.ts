import { ControllerFor } from "controller";
import { ClientUser } from "models/structures";
import { GetProfilesEndpoint } from "../discord/endpoints";
import { ParamsOf, ResultOf } from "../discord/endpoint";

export class GetProfilesController extends ControllerFor<GetProfilesEndpoint> {
  requireUsersDiscordId = (ctx: ParamsOf<GetProfilesEndpoint>) => {
    const users: string[] = [];
    if ("author" in ctx && ctx.author) users.push(ctx.author);
    if ("owner" in ctx && ctx.owner) users.push(ctx.owner);
    return users;
  };

  async action(ctx: ParamsOf<GetProfilesEndpoint>, client: ClientUser): Promise<ResultOf<GetProfilesEndpoint>> {
    const target = await client.users.getByDiscordId(ctx.target);
    if (!target) throw Error();

    const profiles = await target.getProfiles();
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
