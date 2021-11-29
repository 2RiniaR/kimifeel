import { IdentityProfile, Profile } from "../structures/profile";
import { ContextModel } from "../context";
import { buildProfile } from "~/models/repositories/builders/profile";
import { getProfileById, getProfileByIndex } from "~/models/repositories/queries/profile";

export class ProfileManager extends ContextModel {
  public async getByIndex(index: number): Promise<Profile | undefined> {
    const result = await getProfileByIndex(this.context.clientUser.id, index);
    if (!result) return;
    return buildProfile(this.context, result);
  }

  public async fetch(profile: IdentityProfile): Promise<Profile> {
    const result = await getProfileById(profile.target.id, profile.id);
    if (!result) {
      throw Error("Tried to fetch data, but it wasn't found.");
    }
    return buildProfile(this.context, result);
  }
}
