import { ControllerFor } from "../base";
import { ClientUser, User } from "models/structures";
import { SearchRequestsEndpoint, SearchRequestsEndpointParams, SearchRequestsEndpointResult } from "endpoints";

export class SearchRequestsController extends ControllerFor<SearchRequestsEndpoint> {
  public static readonly count: number = 5;

  async action(ctx: SearchRequestsEndpointParams, client: ClientUser): Promise<SearchRequestsEndpointResult> {
    let applicant: User | undefined = undefined;
    if (ctx.applicantDiscordId) {
      applicant = await client.users.findByDiscordId(ctx.applicantDiscordId);
      if (!applicant) {
        throw new Error();
      }
    }

    let target: User | undefined = undefined;
    if (ctx.targetDiscordId) {
      target = await client.users.findByDiscordId(ctx.targetDiscordId);
      if (!target) {
        throw new Error();
      }
    }

    const requests = await client.asUser().searchRequests({
      order: ctx.order,
      start: (ctx.page - 1) * SearchRequestsController.count,
      count: SearchRequestsController.count,
      content: ctx.content,
      status: ctx.status,
      target: target,
      applicant: applicant
    });

    return requests.map((request) => {
      return {
        targetUserId: request.profile.owner.discordId,
        requesterUserId: request.profile.author.discordId,
        content: request.profile.content,
        index: request.index
      };
    });
  }
}
