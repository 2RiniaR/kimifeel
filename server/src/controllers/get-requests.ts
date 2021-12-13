import { ControllerFor } from "./base";
import { ClientUser, Request } from "models/structures";
import { GetRequestsEndpoint, GetRequestsEndpointParams, GetRequestsEndpointResult } from "endpoints";

export class GetRequestsController extends ControllerFor<GetRequestsEndpoint> {
  requireUsersDiscordId = (ctx: GetRequestsEndpointParams) => {
    const users: string[] = [];
    if ("targetDiscordId" in ctx && ctx.targetDiscordId) {
      users.push(ctx.targetDiscordId);
    }
    return users;
  };

  async byTime(ctx: GetRequestsEndpointParams, client: ClientUser) {
    if (ctx.method !== "oldest" && ctx.method !== "latest") throw Error();
    return await client.asUser().searchRequests({
      status: ctx.genre,
      order: ctx.method,
      start: ctx.page,
      count: 5
    });
  }

  async byReceivedSpecific(ctx: GetRequestsEndpointParams, client: ClientUser) {
    if (ctx.method !== "specific" || ctx.genre !== "received") throw Error();

    const request = await client.asUser().getRequestByIndex(ctx.index);
    if (!request) throw Error();

    return [request];
  }

  async bySentSpecific(ctx: GetRequestsEndpointParams, client: ClientUser) {
    if (ctx.method !== "specific" || ctx.genre !== "sent") throw Error();

    const target = await client.users.findByDiscordId(ctx.targetDiscordId);
    if (!target) throw Error();

    const request = await target.getRequestByIndex(ctx.index);
    if (!request) throw Error();

    return [request];
  }

  async action(ctx: GetRequestsEndpointParams, client: ClientUser): Promise<GetRequestsEndpointResult> {
    let requests: Request[];
    if (ctx.method === "oldest" || ctx.method === "latest") {
      requests = await this.byTime(ctx, client);
    } else {
      if (ctx.genre === "received") {
        requests = await this.byReceivedSpecific(ctx, client);
      } else {
        requests = await this.bySentSpecific(ctx, client);
      }
    }

    return await requests.mapAsync(async (requests) => {
      const owner = await client.users.fetch(requests.target);
      const author = await client.users.fetch(requests.profile.author);
      return {
        targetUserId: owner.discordId,
        requesterUserId: author.discordId,
        content: requests.profile.content,
        index: requests.index
      };
    });
  }
}
