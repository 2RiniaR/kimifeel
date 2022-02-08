import { ClientUser, User } from "../../models/structures";
import * as EndpointError from "../../endpoints/errors";
import { UserBody, UserSpecifier } from "../../endpoints";
import { withHandleModelErrors } from "../errors";

export class UserService {
  public toBody(user: User): UserBody {
    return {
      id: user.id,
      discordId: user.discordId,
      enableMention: user.enableMention
    };
  }

  public async find(client: ClientUser, specifier: UserSpecifier): Promise<User> {
    const user = await withHandleModelErrors(() => client.users.find(specifier));
    if (!user) throw new EndpointError.UserNotFoundError(specifier);
    return user;
  }
}
