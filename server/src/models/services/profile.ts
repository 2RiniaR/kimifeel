import { ContextModel } from "../context-model";
import { Profile } from "../structures";
import { buildProfile } from "../builders/profile";
import { NotFoundError } from "../errors";
import * as db from "../../prisma";

export class ProfileService extends ContextModel {
  private readonly profile: Profile;

  public constructor(profile: Profile) {
    super(profile.context);
    this.profile = profile;
  }

  public async delete(): Promise<Profile> {
    const result = await db.deleteProfileByIndex(this.profile.index);
    if (!result) {
      throw new NotFoundError();
    }
    return buildProfile(this.context, result);
  }
}
