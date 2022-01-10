import { ProfileEndpointResponder } from "../endpoints/profile";
import * as Endpoint from "../endpoints/profile";
import * as EndpointError from "../endpoints/errors";
import { Controller } from "./base";
import { ForbiddenError, InvalidParameterError } from "../models/errors";
import { ClientUser, Profile } from "../models/structures";

class ProfileControllerService {
  async getProfileByIndex(client: ClientUser, index: number): Promise<Profile> {
    const profile = await client.profiles.findByIndex(index);
    if (!profile) {
      throw new EndpointError.ProfileNotFoundError({ index });
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
      if (error instanceof ForbiddenError) {
        throw new EndpointError.ProfileNotFoundError({ index: params.index });
      }
      throw error;
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
    const resultPerPage = 5;
    const client = await this.getClientUser(clientDiscordId);

    const profiles = await client.profiles.random({
      count: resultPerPage,
      content: params.content,
      author: await this.getUserIfHasValue(client, params.authorDiscordId),
      owner: await this.getUserIfHasValue(client, params.ownerDiscordId)
    });

    return profiles.map((profile) => this.convertProfileToResult(profile));
  }

  async search(clientDiscordId: string, params: Endpoint.SearchParams): Promise<Endpoint.SearchResult> {
    const resultPerPage = 5;
    const client = await this.getClientUser(clientDiscordId);

    let profiles;

    try {
      profiles = await client.profiles.search({
        order: params.order,
        start: (params.page - 1) * resultPerPage,
        count: resultPerPage,
        content: params.content,
        author: await this.getUserIfHasValue(client, params.authorDiscordId),
        owner: await this.getUserIfHasValue(client, params.ownerDiscordId)
      });
    } catch (error) {
      if (error instanceof InvalidParameterError && error.key === "start") {
        throw new EndpointError.ParameterFormatInvalidError<Endpoint.SearchParams>("page", ">= 1");
      }
      throw error;
    }

    return profiles.map((profile) => this.convertProfileToResult(profile));
  }
}
