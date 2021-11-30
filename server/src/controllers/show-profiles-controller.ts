import { Controller } from "controller";
import { ShowProfilesAction, ShowProfilesParams } from "discord/actions";
import { ClientUser } from "models/structures";

export class ShowProfilesController extends Controller<ShowProfilesAction> {
  requireUsersDiscordId = (ctx: ShowProfilesParams) => [ctx.target];

  async action(ctx: ShowProfilesParams, client: ClientUser) {
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
