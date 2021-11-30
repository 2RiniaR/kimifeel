import { getProfileById } from "../queries/profile";
import { ContextModel } from "../context-model";
import { IdentityProfile, Profile } from "../structures";
import { buildProfile } from "../builders/profile";

export class ProfileManager extends ContextModel {
  public async fetch(profile: IdentityProfile): Promise<Profile> {
    const result = await getProfileById(profile.target.id, profile.id);
    if (!result) {
      throw Error("Tried to fetch data, but it wasn't found.");
    }
    return buildProfile(this.context, result);
  }
}
