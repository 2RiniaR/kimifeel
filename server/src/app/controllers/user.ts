import * as Endpoint from "app/endpoints";
import { ClientUserService, UserService } from "./services";
import { withConvertModelErrors } from "./errors";

export class UserController implements Endpoint.UserEndpoint {
  async config(clientId: string, params: Endpoint.UserConfigParams): Promise<Endpoint.UserBody> {
    const client = await new ClientUserService().getById(clientId);
    const user = await withConvertModelErrors.invoke(() =>
      client.asUser().updateConfig({
        enableMention: params.enableMention
      })
    );
    return new UserService().toBody(user);
  }

  async getStats(clientId: string, specifier: Endpoint.UserSpecifier): Promise<Endpoint.UserStatsBody> {
    const client = await new ClientUserService().getById(clientId);
    const user = await withConvertModelErrors.invoke(() => client.users.find(specifier));
    if (!user) throw new Endpoint.UserNotFoundError(specifier);
    const stats = await withConvertModelErrors.invoke(() => user.getStats());
    return {
      ...new UserService().toBody(user),
      ...stats
    };
  }

  async findMany(clientId: string, specifiers: Endpoint.UserSpecifier[]): Promise<Endpoint.UserBody[]> {
    const client = await new ClientUserService().getById(clientId);
    const users = await withConvertModelErrors.invoke(() => client.users.findMany(specifiers));
    const userService = new UserService();
    return users.map((user) => userService.toBody(user));
  }
}
