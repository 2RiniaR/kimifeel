import { ClientUser, Profile, Request, User } from "../models/structures";
import { ClientUserManager } from "../models/managers";
import * as EndpointError from "../endpoints/errors";
import { ProfileResult, RequestResult } from "../endpoints/structures";
import { DataAccessFailedError } from "../models/errors";

export abstract class Controller {
  async getClientUser(discordId: string): Promise<ClientUser> {
    const service = new ClientUserManager();

    let client;
    try {
      client = await service.findByDiscordId(discordId);
    } catch (error) {
      if (error instanceof DataAccessFailedError) {
        throw new EndpointError.UnavailableError();
      }
      throw error;
    }

    if (!client) {
      throw new EndpointError.ClientUserNotExistError({ discordId });
    }
    return client;
  }

  async getUser(client: ClientUser, discordId: string): Promise<User> {
    let user;
    try {
      user = await client.users.findByDiscordId(discordId);
    } catch (error) {
      if (error instanceof DataAccessFailedError) {
        throw new EndpointError.UnavailableError();
      }
      throw error;
    }

    if (!user) {
      throw new EndpointError.UserNotFoundError({ discordId });
    }
    return user;
  }

  getUserIfHasValue(client: ClientUser, discordId: string | undefined): Promise<User> | undefined {
    if (!discordId) return undefined;
    return this.getUser(client, discordId);
  }

  convertRequestToResult(request: Request): RequestResult {
    return {
      index: request.index,
      content: request.profile.content,
      requesterUserId: request.profile.author.discordId,
      targetUserId: request.profile.owner.discordId
    };
  }

  convertProfileToResult(profile: Profile): ProfileResult {
    return {
      index: profile.index,
      content: profile.content,
      authorUserId: profile.author.discordId,
      ownerUserId: profile.owner.discordId
    };
  }
}
