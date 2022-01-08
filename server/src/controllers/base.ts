import { ClientUser, Profile, Request, User } from "../models/structures";
import { ClientUserManager } from "../models/managers";
import * as EndpointError from "../endpoints/errors";
import { ProfileResult, RequestResult } from "../endpoints/structures";

export abstract class Controller {
  async getClientUser(discordId: string): Promise<ClientUser> {
    const service = new ClientUserManager();
    const client = await service.findByDiscordId(discordId);
    if (!client) {
      throw new EndpointError.ClientUserNotExistError({ discordId });
    }
    return client;
  }

  async getUser(client: ClientUser, discordId: string): Promise<User> {
    const user = await client.users.findByDiscordId(discordId);
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
