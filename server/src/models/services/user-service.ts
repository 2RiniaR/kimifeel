import { IdentityUser, ImaginaryUser, Profile, Request } from "../structures";
import { getAllProfiles, getProfileByIndex } from "../queries/profile";
import { getRequestByIndex } from "../queries/request";
import { ContextModel } from "../context-model";
import { buildProfile } from "../builders/profile";
import { createUserIfNotExist } from "../queries/user";
import { buildClientUser } from "../builders/client-user";
import { buildRequest } from "../builders/request";

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

  public async getProfileByIndex(index: number): Promise<Profile | undefined> {
    const result = await getProfileByIndex(this.user.id, index);
    if (!result) return;
    return buildProfile(this.context, result);
  }

  public async getRequestByIndex(index: number): Promise<Request | undefined> {
    const result = await getRequestByIndex(this.user.id, index);
    if (!result) return;
    return buildRequest(this.context, result);
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
