import { UserAlreadyRegisteredError } from "../../app/models/errors";
import * as EndpointError from "../endpoints/errors";
import { AuthEndpointResponder, AuthParams, AuthResult } from "../endpoints/auth";
import { DiscordUser } from "../models/structures/discord-user";
import { AuthorizedUser } from "../models/structures/authorized-user";
import { withHandleModelErrors } from "./errors";

export class AuthController implements AuthEndpointResponder {
  public async register(params: AuthParams): Promise<AuthResult> {
    const discordUser = new DiscordUser(params.discordId);
    const user = await withHandleModelErrors(async () => {
      try {
        return await discordUser.register();
      } catch (error) {
        if (error instanceof UserAlreadyRegisteredError) {
          throw new EndpointError.UserAlreadyRegisteredError();
        }
        throw error;
      }
    });
    return { clientId: user.id };
  }

  public async unregister(params: AuthParams): Promise<AuthResult> {
    const user = await new AuthControllerService().getAuthorizedUser(params);
    await withHandleModelErrors(() => user.unregister());
    return { clientId: user.id };
  }

  public async authorize(params: AuthParams): Promise<AuthResult> {
    const user = await new AuthControllerService().getAuthorizedUser(params);
    return { clientId: user.id };
  }
}

class AuthControllerService {
  public async getAuthorizedUser(params: AuthParams): Promise<AuthorizedUser> {
    const discordUser = new DiscordUser(params.discordId);
    const user = await withHandleModelErrors(() => discordUser.authorize());
    if (!user) throw new EndpointError.UserNotFoundError();
    return user;
  }
}
