import { ContextModel } from "../context-model";
import { createProfile, deleteProfile } from "../queries/profile";
import { IdentityProfile, ImaginaryProfile } from "../structures";
import { buildProfile } from "../builders/profile";

export class ProfileService extends ContextModel {
  private readonly profile: IdentityProfile;

  public constructor(profile: IdentityProfile) {
    super(profile.context);
    this.profile = profile;
  }

  public async delete() {
    await deleteProfile(this.context.clientUser.id, this.profile.id);
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
      userId: this.profile.user.id,
      authorUserId: this.profile.author.id,
      content: this.profile.content
    });
    return buildProfile(this.context, result);
  }
}
