import { Profile } from "../structures/profile";
import { ContextModel } from "../context";
import { buildProfile } from "~/models/repositories/builders/profile";
import { getProfileByIndex } from "~/models/repositories/queries/profile";

export class ProfileManager extends ContextModel {
  public async getByIndex(index: number): Promise<Profile | undefined> {
    const result = await getProfileByIndex(this.context.clientUser.id, index);
    if (!result) return;
    return buildProfile(this.context, result);
  }
}
