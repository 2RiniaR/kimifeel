import { ControllerFor, RunnerFor } from "../base";
import { ClientUser, User } from "models/structures";
import { SearchRequestsEndpoint, SearchRequestsEndpointParams } from "endpoints";

export class SearchRequestsRunner extends RunnerFor<SearchRequestsEndpoint> {
  generate(params: SearchRequestsEndpointParams, client: ClientUser): ControllerFor<SearchRequestsEndpoint> {
    return new SearchRequestsController(params, client);
  }
}

export class SearchRequestsController extends ControllerFor<SearchRequestsEndpoint> {
  public static readonly count: number = 5;

  async run() {
    let applicant: User | undefined = undefined;
    if (this.context.applicantDiscordId) {
      applicant = await this.client.users.findByDiscordId(this.context.applicantDiscordId);
      if (!applicant) {
        throw new Error();
      }
    }

    let target: User | undefined = undefined;
    if (this.context.targetDiscordId) {
      target = await this.client.users.findByDiscordId(this.context.targetDiscordId);
      if (!target) {
        throw new Error();
      }
    }

    const requests = await this.client.asUser().searchRequests({
      order: this.context.order,
      start: (this.context.page - 1) * SearchRequestsController.count,
      count: SearchRequestsController.count,
      content: this.context.content,
      status: this.context.status,
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
