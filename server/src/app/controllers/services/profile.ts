import { ClientUser, Profile } from "app/models";
import * as Endpoint from "app/endpoints";
import { withConvertModelErrors } from "../errors";
import { UserService } from "./user";

export class ProfileService {
  public toBody(profile: Profile): Endpoint.ProfileBody {
    const userService = new UserService();
    return {
      index: profile.index,
      content: profile.content,
      author: userService.toBody(profile.author),
      owner: userService.toBody(profile.owner)
    };
  }

  public async find(client: ClientUser, specifier: Endpoint.ProfileSpecifier): Promise<Profile> {
    const profile = await withConvertModelErrors.invoke(() => {
      if (specifier.id) {
        return client.profiles.find({ id: specifier.id });
      } else if (specifier.index) {
        return client.profiles.find({ index: specifier.index });
      } else {
        throw new Endpoint.ParameterStructureInvalidError();
      }
    });
    if (!profile) throw new Endpoint.ProfileNotFoundError(specifier);
    return profile;
  }
}
