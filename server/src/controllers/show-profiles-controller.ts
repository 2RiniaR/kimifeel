import { ShowProfilesParams, ShowProfilesAction } from "~/discord/actions/show-profiles-action";
import { Controller } from "~/controller";
import { ClientUser } from "~/models/context/client-user";
import { NotFoundError } from "~/models/errors/not-found-error";

export class ShowProfilesController extends Controller<ShowProfilesAction> {
  requireUsersDiscordId = (ctx: ShowProfilesParams) => [ctx.client, ctx.target];

  async action(ctx: ShowProfilesParams, client: ClientUser) {
    const target = await client.services.users.getByDiscordId(ctx.target);
    if (!target) throw new NotFoundError();
    const profiles = await target.getProfiles();
    return profiles.map((profile) => {
      if (!profile.author || !profile.content || !profile.index) throw Error();
      if (!profile.author.discordId) throw Error();
      return {
        author: profile.author.discordId,
        content: profile.content,
        index: profile.index
      };
    });
  }
}
