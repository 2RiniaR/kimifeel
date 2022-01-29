import { UserEndpointResponder } from "../endpoints/user";
import { ClientUserManager } from "../models/managers";
import { Controller } from "./base";
import * as EndpointError from "../endpoints/errors";
import * as Endpoint from "../endpoints/user";
import { DataAccessFailedError, UserAlreadyRegisteredError } from "../models/errors";
import { User } from "../models/structures";

export class UserController extends Controller implements UserEndpointResponder {
  async register(clientDiscordId: string) {
    try {
      await new ClientUserManager().register(clientDiscordId);
    } catch (error) {
      if (error instanceof UserAlreadyRegisteredError) {
        throw new EndpointError.UserAlreadyRegisteredError({ discordId: clientDiscordId });
      }
      if (error instanceof DataAccessFailedError) {
        throw new EndpointError.UnavailableError();
      }
      throw error;
    }
  }

  async unregister(clientDiscordId: string) {
    const client = await this.getClientUser(clientDiscordId);

    try {
      await client.unregister();
    } catch (error) {
      if (error instanceof DataAccessFailedError) {
        throw new EndpointError.UnavailableError();
      }
      throw error;
    }
  }

  async config(clientDiscordId: string, params: Endpoint.ConfigParams): Promise<Endpoint.ConfigResult> {
    const client = await this.getClientUser(clientDiscordId);

    let user;
    try {
      user = await client.asUser().updateConfig({
        enableMention: params.enableMention
      });
    } catch (error) {
      if (error instanceof DataAccessFailedError) {
        throw new EndpointError.UnavailableError();
      }
      throw error;
    }

    return {
      discordId: user.discordId,
      enableMention: user.enableMention
    };
  }

  async getStats(clientDiscordId: string, params: Endpoint.GetStatsParams): Promise<Endpoint.GetStatsResult> {
    const client = await this.getClientUser(clientDiscordId);

    let user: User | undefined;
    try {
      user = await client.users.findByDiscordId(params.targetUserDiscordId);
    } catch (error) {
      if (error instanceof DataAccessFailedError) {
        throw new EndpointError.UnavailableError();
      }
      throw error;
    }

    if (!user) {
      throw new EndpointError.UserNotFoundError({ discordId: params.targetUserDiscordId });
    }

    let stats;
    try {
      stats = await user.getStats();
    } catch (error) {
      if (error instanceof DataAccessFailedError) {
        throw new EndpointError.UnavailableError();
      }
      throw error;
    }

    return {
      discordId: user.discordId,
      ...stats
    };
  }

  async checkMentionable(
    clientDiscordId: string,
    params: Endpoint.CheckMentionableParams
  ): Promise<Endpoint.CheckMentionableResult> {
    const client = await this.getClientUser(clientDiscordId);

    let users: User[];
    try {
      users = await client.users.findManyByDiscordId(params.targetUsersDiscordId);
    } catch (error) {
      if (error instanceof DataAccessFailedError) {
        throw new EndpointError.UnavailableError();
      }
      throw error;
    }

    const result: Endpoint.CheckMentionableResult = {};
    for (const discordId of params.targetUsersDiscordId) {
      const user = users.find((user) => user.discordId === discordId);
      result[discordId] = user ? user.enableMention : false;
    }
    return result;
  }
}
