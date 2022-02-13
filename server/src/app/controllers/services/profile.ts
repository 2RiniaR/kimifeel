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
    const profile = await withConvertModelErrors.invoke(() => client.profiles.find(specifier));
    if (!profile) throw new Endpoint.ProfileNotFoundError(specifier);
    return profile;
  }
}
