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
    const user = await withConvertModelErrors.invokeAsync(() => {
      if (specifier.id !== undefined) {
        return client.users.find({ id: specifier.id });
      } else if (specifier.discordId !== undefined) {
        return client.users.find({ discordId: specifier.discordId });
      } else {
        throw new Endpoint.ParameterStructureInvalidError();
      }
    });
    if (user === undefined) throw new Endpoint.UserNotFoundError(specifier);
    return user;
  }
}
