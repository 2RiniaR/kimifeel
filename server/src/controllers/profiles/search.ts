import { ControllerFor } from "../base";
import { ClientUser, User } from "models/structures";
import { SearchProfilesEndpoint, SearchProfilesEndpointParams, SearchProfilesEndpointResult } from "endpoints";

export class SearchProfilesController extends ControllerFor<SearchProfilesEndpoint> {
  public static readonly count: number = 5;

  async action(ctx: SearchProfilesEndpointParams, client: ClientUser): Promise<SearchProfilesEndpointResult> {
    let owner: User | undefined = undefined;
    if (ctx.ownerDiscordId) {
      owner = await client.users.findByDiscordId(ctx.ownerDiscordId);
      if (!owner) {
        throw new Error();
      }
    }

    let author: User | undefined = undefined;
    if (ctx.authorDiscordId) {
      author = await client.users.findByDiscordId(ctx.authorDiscordId);
      if (!author) {
        throw new Error();
      }
    }

    const profiles = await client.profiles.search({
      order: ctx.order,
      start: (ctx.page - 1) * SearchProfilesController.count,
      count: SearchProfilesController.count,
      content: ctx.content,
      author: author,
      owner: owner
    });

    return profiles.map((profile) => {
      return {
        index: profile.index,
        content: profile.content,
        ownerUserId: profile.owner.discordId,
        authorUserId: profile.author.discordId
      };
    });
  }
}
