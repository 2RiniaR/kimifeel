import { ContextModel } from "../context-model";
import { Profile, ImaginaryProfile } from "../structures";
import { buildProfile } from "../builders/profile";
import { createProfile, deleteProfileByIndex } from "../../prisma";
import { NotFoundError } from "../errors";

export class ProfileService extends ContextModel {
  private readonly profile: Profile;

  public constructor(profile: Profile) {
    super(profile.context);
    this.profile = profile;
  }

  public async delete(): Promise<Profile> {
    const result = await deleteProfileByIndex(this.profile.index);
    if (!result) {
      throw new NotFoundError();
    }
    return buildProfile(this.context, result);
  }
}

export class ImaginaryProfileService extends ContextModel {
  private readonly profile: ImaginaryProfile;

  public constructor(profile: ImaginaryProfile) {
    super(profile.context);
    this.profile = profile;
  }

  public async create() {
    const result = await createProfile({
      ownerUserId: this.profile.owner.id,
      authorUserId: this.profile.author.id,
      content: this.profile.content
    });
    return buildProfile(this.context, result);
  }
}
