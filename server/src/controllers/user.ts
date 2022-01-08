import { UserEndpointResponder } from "../endpoints/user";
import { ClientUserManager } from "../models/managers";
import { Controller } from "./base";
import { UserAlreadyRegisteredError } from "../models/structures";
import * as EndpointError from "../endpoints/errors";

export class UserController extends Controller implements UserEndpointResponder {
  async register(clientDiscordId: string) {
    try {
      await new ClientUserManager().register(clientDiscordId);
    } catch (error) {
      if (error instanceof UserAlreadyRegisteredError) {
        throw new EndpointError.UserAlreadyRegisteredError({ discordId: clientDiscordId });
      }
      throw error;
    }
  }

  async unregister(clientDiscordId: string) {
    const client = await this.getClientUser(clientDiscordId);
    await client.unregister();
  }
}
