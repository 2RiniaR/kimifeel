import { ConfigParams, UserEndpointResponder } from "../endpoints/user";
import * as EndpointError from "../endpoints/errors";
import { ClientUserService, UserService } from "./services";
import { UserBody, UserSpecifier, UserStatsBody } from "../endpoints/structures";
import { withHandleModelErrors } from "./errors";

export class UserController implements UserEndpointResponder {
  async config(clientId: string, params: ConfigParams): Promise<UserBody> {
    const client = await new ClientUserService().getById(clientId);
    const user = await withHandleModelErrors(() =>
      client.asUser().updateConfig({
        enableMention: params.enableMention
      })
    );
    return new UserService().toBody(user);
  }

  async getStats(clientId: string, specifier: UserSpecifier): Promise<UserStatsBody> {
    const client = await new ClientUserService().getById(clientId);
    const user = await withHandleModelErrors(() => client.users.find(specifier));
    if (!user) throw new EndpointError.UserNotFoundError(specifier);
    const stats = await withHandleModelErrors(() => user.getStats());
    return {
      ...new UserService().toBody(user),
      ...stats
    };
  }

  async findMany(clientId: string, specifiers: UserSpecifier[]): Promise<UserBody[]> {
    const client = await new ClientUserService().getById(clientId);
    const users = await withHandleModelErrors(() => client.users.findMany(specifiers));
    const userService = new UserService();
    return users.map((user) => userService.toBody(user));
  }
}
