import { DiscordUser, AuthorizedUser, UserAlreadyRegisteredError } from "auth/models";
import * as Endpoint from "auth/endpoints";
import { withConvertModelErrors } from "./errors";

export class AuthController implements Endpoint.AuthEndpoint {
  public async register(params: Endpoint.AuthParams): Promise<Endpoint.ClientBody> {
    const discordUser = new DiscordUser(params.discordId);
    const user = await withConvertModelErrors
      .guard((error) => {
        if (error instanceof UserAlreadyRegisteredError) throw new Endpoint.UserAlreadyRegisteredError(params);
      })
      .invoke(() => discordUser.register());
    return { clientId: user.id };
  }

  public async unregister(params: Endpoint.AuthParams): Promise<Endpoint.ClientBody> {
    const user = await new AuthControllerService().getAuthorizedUser(params);
    await withConvertModelErrors.invoke(() => user.unregister());
    return { clientId: user.id };
  }

  public async authorize(params: Endpoint.AuthParams): Promise<Endpoint.ClientBody> {
    const user = await new AuthControllerService().getAuthorizedUser(params);
    return { clientId: user.id };
  }
}

class AuthControllerService {
  public async getAuthorizedUser(params: Endpoint.AuthParams): Promise<AuthorizedUser> {
    const discordUser = new DiscordUser(params.discordId);
    const user = await withConvertModelErrors.invoke(() => discordUser.authorize());
    if (!user) throw new Endpoint.UserNotFoundError(params);
    return user;
  }
}
