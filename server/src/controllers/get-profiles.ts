import { ControllerFor } from "./base";
import { ClientUser, Profile } from "models/structures";
import { GetProfilesEndpoint, GetProfilesEndpointParams, GetProfilesEndpointResult } from "endpoints";

export class GetProfilesController extends ControllerFor<GetProfilesEndpoint> {
  requireUsersDiscordId = (ctx: GetProfilesEndpointParams) => {
    const users: string[] = [];
    if ("authorDiscordId" in ctx && ctx.authorDiscordId) {
      users.push(ctx.authorDiscordId);
    }
    if ("ownerDiscordId" in ctx && ctx.ownerDiscordId) {
      users.push(ctx.ownerDiscordId);
    }
    return users;
  };

  async byTime(ctx: GetProfilesEndpointParams, client: ClientUser) {
    if (ctx.method !== "oldest" && ctx.method !== "latest") throw Error();

    const owner = ctx.ownerDiscordId ? await client.users.findByDiscordId(ctx.ownerDiscordId) : undefined;
    const author = ctx.authorDiscordId ? await client.users.findByDiscordId(ctx.authorDiscordId) : undefined;
    return await client.profiles.search({
      order: ctx.method,
      start: ctx.page,
      count: 5,
      content: ctx.content,
      owner: owner,
      author: author
    });
  }

  async byRandom(ctx: GetProfilesEndpointParams, client: ClientUser) {
    if (ctx.method !== "random") throw Error();

    const owner = ctx.ownerDiscordId ? await client.users.findByDiscordId(ctx.ownerDiscordId) : undefined;
    const author = ctx.authorDiscordId ? await client.users.findByDiscordId(ctx.authorDiscordId) : undefined;
    return await client.profiles.search({
      order: ctx.method,
      count: 5,
      content: ctx.content,
      owner: owner,
      author: author
    });
  }

  async bySpecific(ctx: GetProfilesEndpointParams, client: ClientUser) {
    if (ctx.method !== "specific") throw Error();

    const owner = await client.users.findByDiscordId(ctx.ownerDiscordId);
    if (!owner) throw Error();

    const profile = await owner.getProfileByIndex(ctx.index);
    if (!profile) throw Error();

    return [profile];
  }

  async action(ctx: GetProfilesEndpointParams, client: ClientUser): Promise<GetProfilesEndpointResult> {
    let profiles: Profile[];
    if (ctx.method === "oldest" || ctx.method === "latest") {
      profiles = await this.byTime(ctx, client);
    } else if (ctx.method === "random") {
      profiles = await this.byRandom(ctx, client);
    } else {
      profiles = await this.bySpecific(ctx, client);
    }

    return await profiles.mapAsync(async (profile) => {
      const owner = await client.users.fetch(profile.target);
      const author = await client.users.fetch(profile.author);
      return {
        ownerUserId: owner.discordId,
        authorUserId: author.discordId,
        content: profile.content,
        index: profile.index
      };
    });
  }
}
