import { ClientUser, Profile } from "../../models/structures";
import { ProfileBody, ProfileSpecifier } from "../../endpoints";
import * as EndpointError from "../../endpoints/errors";
import { withHandleModelErrors } from "../errors";
import { UserService } from "./user";

export class ProfileService {
  public toBody(profile: Profile): ProfileBody {
    const userService = new UserService();
    return {
      index: profile.index,
      content: profile.content,
      author: userService.toBody(profile.author),
      owner: userService.toBody(profile.owner)
    };
  }

  public async find(client: ClientUser, specifier: ProfileSpecifier): Promise<Profile> {
    const profile = await withHandleModelErrors(() => client.profiles.find(specifier));
    if (!profile) throw new EndpointError.ProfileNotFoundError(specifier);
    return profile;
  }
}
