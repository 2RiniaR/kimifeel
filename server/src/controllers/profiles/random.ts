import { ControllerFor, RunnerFor } from "../base";
import { ClientUser, User } from "models/structures";
import { RandomProfilesEndpoint, RandomProfilesEndpointParams, RandomProfilesEndpointResult } from "endpoints";

export class RandomProfilesRunner extends RunnerFor<RandomProfilesEndpoint> {
  generate(params: RandomProfilesEndpointParams, client: ClientUser): ControllerFor<RandomProfilesEndpoint> {
    return new RandomProfilesController(params, client);
  }
}

export class RandomProfilesController extends ControllerFor<RandomProfilesEndpoint> {
  public static readonly count: number = 5;

  async run(): Promise<RandomProfilesEndpointResult> {
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

    const profiles = await this.client.profiles.random({
      count: RandomProfilesController.count,
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
