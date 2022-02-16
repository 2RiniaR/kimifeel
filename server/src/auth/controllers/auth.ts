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
      .invokeAsync(() => discordUser.register());
    return new AuthControllerService().toBody(user);
  }

  public async unregister(params: Endpoint.AuthParams): Promise<Endpoint.ClientBody> {
    const service = new AuthControllerService();
    const user = await service.getAuthorizedUser(params);
    await withConvertModelErrors.invokeAsync(() => user.unregister());
    return service.toBody(user);
  }

  public async authorize(params: Endpoint.AuthParams): Promise<Endpoint.ClientBody> {
    const service = new AuthControllerService();
    const user = await withConvertModelErrors.invokeAsync(() => service.getAuthorizedUser(params));
    return service.toBody(user);
  }
}

class AuthControllerService {
  public async getAuthorizedUser(params: Endpoint.AuthParams): Promise<AuthorizedUser> {
    const discordUser = new DiscordUser(params.discordId);
    const user = await withConvertModelErrors.invokeAsync(() => discordUser.authorize());
    if (user === undefined) throw new Endpoint.UserNotFoundError(params);
    return user;
  }

  public toBody(user: AuthorizedUser): Endpoint.ClientBody {
    return {
      id: user.id,
      discordId: user.discordId
    };
  }
}
