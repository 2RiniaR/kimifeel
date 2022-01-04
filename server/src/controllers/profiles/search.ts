import { ControllerFor, RunnerFor } from "../base";
import { ClientUser, User } from "models/structures";
import { SearchProfilesEndpoint, SearchProfilesEndpointParams } from "endpoints";

export class SearchProfilesRunner extends RunnerFor<SearchProfilesEndpoint> {
  generate(params: SearchProfilesEndpointParams, client: ClientUser): ControllerFor<SearchProfilesEndpoint> {
    return new SearchProfilesController(params, client);
  }
}

export class SearchProfilesController extends ControllerFor<SearchProfilesEndpoint> {
  public static readonly count: number = 5;

  async run() {
    let owner: User | undefined = undefined;
    if (this.context.ownerDiscordId) {
      owner = await this.client.users.findByDiscordId(this.context.ownerDiscordId);
      if (!owner) {
        throw new Error();
      }
    }

    let author: User | undefined = undefined;
    if (this.context.authorDiscordId) {
      author = await this.client.users.findByDiscordId(this.context.authorDiscordId);
      if (!author) {
        throw new Error();
      }
    }

    const profiles = await this.client.profiles.search({
      order: this.context.order,
      start: (this.context.page - 1) * SearchProfilesController.count,
      count: SearchProfilesController.count,
      content: this.context.content,
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
