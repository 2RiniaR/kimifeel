import { ClientUser, User } from "app/models";
import * as Endpoint from "app/endpoints";
import { withConvertModelErrors } from "../errors";

export class UserService {
  public toBody(user: User): Endpoint.UserBody {
    return {
      id: user.id,
      discordId: user.discordId,
      enableMention: user.enableMention
    };
  }

  public async find(client: ClientUser, specifier: Endpoint.UserSpecifier): Promise<User> {
    const user = await withConvertModelErrors.invoke(() => client.users.find(specifier));
    if (!user) throw new Endpoint.UserNotFoundError(specifier);
    return user;
  }
}
