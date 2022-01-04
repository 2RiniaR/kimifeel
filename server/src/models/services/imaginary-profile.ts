import { ContextModel } from "../context-model";
import { ImaginaryProfile } from "../structures";
import * as db from "../../prisma";
import { buildProfile } from "../builders/profile";

export class ImaginaryProfileService extends ContextModel {
  private readonly profile: ImaginaryProfile;

  public constructor(profile: ImaginaryProfile) {
    super(profile.context);
    this.profile = profile;
  }

  public async create() {
    const result = await db.createProfile({
      ownerUserId: this.profile.owner.id,
      authorUserId: this.profile.author.id,
      content: this.profile.content
    });
    return buildProfile(this.context, result);
  }
}
