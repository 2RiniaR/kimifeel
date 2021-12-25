import { EndpointListener, RegisterUserEndpointParams, RegisterUserEndpointResult } from "endpoints";
import { ClientUserManager } from "../../models/managers";

export class RegisterUserController
  implements EndpointListener<RegisterUserEndpointParams, RegisterUserEndpointResult>
{
  async runEndpoint(params: RegisterUserEndpointParams): Promise<RegisterUserEndpointResult> {
    await new ClientUserManager().register(params.clientDiscordId);
    return { discordId: params.clientDiscordId };
  }
}
