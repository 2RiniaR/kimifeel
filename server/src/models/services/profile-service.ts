import { ContextModel } from "../context-model";
import { IdentityProfile, ImaginaryProfile } from "../structures";
import { buildProfile } from "../builders/profile";
import { createProfile, deleteProfile } from "firestore/queries/profile-queries";

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
