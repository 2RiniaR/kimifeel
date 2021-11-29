import { getAllProfiles } from "~/models/repositories/queries/profile";
import { buildProfile } from "~/models/repositories/builders/profile";
import { IdentityUser, ImaginaryUser } from "~/models/structures/user";
import { ContextModel } from "~/models/context";
import { Profile } from "~/models/structures/profile";
import { createUserIfNotExist } from "~/models/repositories/queries/user";
import { buildClientUser } from "~/models/repositories/builders/client-user";

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
