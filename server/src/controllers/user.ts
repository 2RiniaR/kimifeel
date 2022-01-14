import { UserEndpointResponder } from "../endpoints/user";
import { ClientUserManager } from "../models/managers";
import { Controller } from "./base";
import * as EndpointError from "../endpoints/errors";
import { DataAccessFailedError, UserAlreadyRegisteredError } from "../models/errors";

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
}
