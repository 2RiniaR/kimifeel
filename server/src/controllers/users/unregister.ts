import { ControllerFor } from "../base";
import { ClientUser } from "models/structures";
import { UnregisterUserEndpoint, UnregisterUserEndpointParams, UnregisterUserEndpointResult } from "endpoints";

export class UnregisterUserController extends ControllerFor<UnregisterUserEndpoint> {
  async action(ctx: UnregisterUserEndpointParams, client: ClientUser): Promise<UnregisterUserEndpointResult> {
    await client.unregister();
    return { discordId: ctx.clientDiscordId };
  }
}
