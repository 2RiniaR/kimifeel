import { IdentityUser, ImaginaryUser, Profile } from "../structures";
import { getAllProfiles } from "../queries/profile";
import { ContextModel } from "../context-model";
import { buildProfile } from "../builders/profile";
import { createUserIfNotExist } from "../queries/user";
import { buildClientUser } from "../builders/client-user";

export class UserService extends ContextModel {
  private readonly user: IdentityUser;

  public constructor(user: IdentityUser) {
    super(user.context);
    this.user = user;
  }

  public async getProfiles(): Promise<Profile[]> {
    const results = await getAllProfiles(this.user.id);
    return results.map((result) => buildProfile(this.context, result));
  }
}

export class ImaginaryUserService {
  private readonly user: ImaginaryUser;

  public constructor(user: ImaginaryUser) {
    this.user = user;
  }

  public async createIfNotExist() {
    const result = await createUserIfNotExist({ discordId: this.user.discordId });
    return buildClientUser(result);
  }
}
