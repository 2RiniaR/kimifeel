import { ControllerFor, RunnerFor } from "../base";
import { ClientUser } from "models/structures";
import { UnregisterUserEndpoint, UnregisterUserEndpointParams } from "endpoints";

export class UnregisterUserRunner extends RunnerFor<UnregisterUserEndpoint> {
  generate(params: UnregisterUserEndpointParams, client: ClientUser): ControllerFor<UnregisterUserEndpoint> {
    return new UnregisterUserController(params, client);
  }
}

export class UnregisterUserController extends ControllerFor<UnregisterUserEndpoint> {
  async run() {
    await this.client.unregister();
    return { discordId: this.context.clientDiscordId };
  }
}
