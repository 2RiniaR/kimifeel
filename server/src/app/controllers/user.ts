import * as Endpoint from "app/endpoints";
import { ClientUserService, UserService } from "./services";
import { withConvertModelErrors } from "./errors";

export class UserController implements Endpoint.UserEndpoint {
  public async config(clientId: string, params: Endpoint.UserConfigParams): Promise<Endpoint.UserBody> {
    const client = await new ClientUserService().getById(clientId);
    const user = await withConvertModelErrors.invokeAsync(() =>
      client.asUser().updateConfig({
        enableMention: params.enableMention
      })
    );
    return new UserService().toBody(user);
  }

  public async getStats(clientId: string, specifier: Endpoint.UserSpecifier): Promise<Endpoint.UserStatsBody> {
    const client = await new ClientUserService().getById(clientId);
    const userService = new UserService();

    const user = await userService.find(client, specifier);
    const stats = await withConvertModelErrors.invokeAsync(() => user.getStats());

    return {
      ...userService.toBody(user),
      ...stats
    };
  }

  public async findMany(clientId: string, specifiers: Endpoint.UserSpecifier[]): Promise<Endpoint.UserBody[]> {
    const client = await new ClientUserService().getById(clientId);
    const userService = new UserService();

    const users = await withConvertModelErrors.invokeAsync(() => {
      const uniques: Parameters<typeof client.users.findMany>[0] = [];
      for (const specifier of specifiers) {
        if (specifier.id !== undefined) uniques.push({ id: specifier.id });
        else if (specifier.discordId !== undefined) uniques.push({ discordId: specifier.discordId });
        else throw new Endpoint.ParameterStructureInvalidError();
      }
      return client.users.findMany(uniques);
    });

    return users.map((user) => userService.toBody(user));
  }
}
