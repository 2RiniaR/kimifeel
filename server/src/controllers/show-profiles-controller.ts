import { Controller } from "~/controller";
import { ClientUser } from "~/models";
import { ShowProfilesAction, ShowProfilesParams } from "~/discord/actions/show-profiles-action";

export class ShowProfilesController extends Controller<ShowProfilesAction> {
  requireUsersDiscordId = (ctx: ShowProfilesParams) => [ctx.target];

  async action(ctx: ShowProfilesParams, client: ClientUser) {
    const target = await client.users.getByDiscordId(ctx.target);
    if (!target) throw Error();

    const profiles = await target.getProfiles();

    return await Promise.all(
      profiles.map(async (profile) => {
        const author = await client.users.fetch(profile.author);
        return {
          author: author.discordId,
          content: profile.content,
          index: profile.index
        };
      })
    );
  }
}
