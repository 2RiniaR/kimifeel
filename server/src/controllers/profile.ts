import { ProfileEndpointResponder } from "../endpoints/profile";
import * as Endpoint from "../endpoints/profile";
import * as EndpointError from "../endpoints/errors";
import { Controller } from "./base";
import { NotFoundError } from "../models/errors";
import { ClientUser, Profile } from "../models/structures";

class ProfileControllerService {
  async getProfileByIndex(client: ClientUser, index: number): Promise<Profile> {
    const profile = await client.profiles.findByIndex(index);
    if (!profile) {
      throw new EndpointError.NotFoundError();
    }
    return profile;
  }
}

export class ProfileController extends Controller implements ProfileEndpointResponder {
  private readonly service = new ProfileControllerService();

  async delete(clientDiscordId: string, params: Endpoint.DeleteParams): Promise<Endpoint.DeleteResult> {
    const client = await this.getClientUser(clientDiscordId);
    const profile = await this.service.getProfileByIndex(client, params.index);

    try {
      await profile.delete();
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new EndpointError.NotFoundError();
      } else {
        throw error;
      }
    }

    return this.convertProfileToResult(profile);
  }

  async find(clientDiscordId: string, params: Endpoint.FindParams): Promise<Endpoint.FindResult> {
    const client = await this.getClientUser(clientDiscordId);
    const profile = await this.service.getProfileByIndex(client, params.index);

    return {
      ownerUserId: profile.owner.discordId,
      authorUserId: profile.author.discordId,
      content: profile.content,
      index: profile.index
    };
  }

  async random(clientDiscordId: string, params: Endpoint.RandomParams): Promise<Endpoint.RandomResult> {
    const client = await this.getClientUser(clientDiscordId);

    const profiles = await client.profiles.random({
      count: 5,
      content: params.content,
      author: await this.getUserIfHasValue(client, params.authorDiscordId),
      owner: await this.getUserIfHasValue(client, params.ownerDiscordId)
    });

    return profiles.map((profile) => this.convertProfileToResult(profile));
  }

  async search(clientDiscordId: string, params: Endpoint.SearchParams): Promise<Endpoint.SearchResult> {
    const client = await this.getClientUser(clientDiscordId);

    const profiles = await client.profiles.search({
      order: params.order,
      start: (params.page - 1) * 5,
      count: 5,
      content: params.content,
      author: await this.getUserIfHasValue(client, params.authorDiscordId),
      owner: await this.getUserIfHasValue(client, params.ownerDiscordId)
    });

    return profiles.map((profile) => this.convertProfileToResult(profile));
  }
}
