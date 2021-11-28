import { NotFoundError } from "~/models/errors/not-found-error";
import { deleteProfile, getProfileById } from "~/models/repositories/queries/profile";
import { buildProfile } from "~/models/repositories/builders/profile";
import { ContextModel } from "~/models/context";
import { Profile } from "~/models/structures/profile";

export class ProfileService extends ContextModel {
  private readonly profile: Profile;

  public constructor(profile: Profile) {
    super(profile.context);
    this.profile = profile;
  }

  public async fetch() {
    const result = await getProfileById(this.profile.target.id, this.profile.id);
    if (!result) throw new NotFoundError();
    const profile = buildProfile(this.context, result);
    this.profile.setProps(profile);
  }

  public async delete() {
    await deleteProfile(this.context.clientUser.id, this.profile.id);
  }
}
