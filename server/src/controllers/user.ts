import { UserEndpointResponder } from "../endpoints/user";
import { ClientUserManager } from "../models/managers";
import { Controller } from "./base";

export class UserController extends Controller implements UserEndpointResponder {
  async register(clientDiscordId: string) {
    await new ClientUserManager().register(clientDiscordId);
  }

  async unregister(clientDiscordId: string) {
    const client = await this.getClientUser(clientDiscordId);
    await client.unregister();
  }
}
