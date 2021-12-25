import { ControllerFor } from "../base";
import { ClientUser, User } from "models/structures";
import { RandomProfilesEndpoint, RandomProfilesEndpointParams, RandomProfilesEndpointResult } from "endpoints";

export class RandomProfilesController extends ControllerFor<RandomProfilesEndpoint> {
  public static readonly count: number = 5;

  async action(ctx: RandomProfilesEndpointParams, client: ClientUser): Promise<RandomProfilesEndpointResult> {
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

    const profiles = await client.profiles.random({
      count: RandomProfilesController.count,
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
