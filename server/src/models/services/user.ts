import { findProfileByIndex } from "firestore/queries/profile-queries";
import { findRequestByIndex, searchRequests } from "firestore/queries/request-queries";
import { createUserIfNotExist } from "firestore/queries/user-queries";
import { IdentityUser, ImaginaryUser, Profile, Request, SearchRequestsProps } from "../structures";
import { ContextModel } from "../context-model";
import { buildProfile } from "../builders/profile";
import { buildClientUser } from "../builders/client-user";
import { buildRequest } from "../builders/request";

export class UserService extends ContextModel {
  private readonly user: IdentityUser;

  public constructor(user: IdentityUser) {
    super(user.context);
    this.user = user;
  }

  public async findProfileByIndex(index: number): Promise<Profile | undefined> {
    const result = await findProfileByIndex(this.user.id, index);
    if (!result) return;
    return buildProfile(this.context, result);
  }

  public async findRequestByIndex(index: number): Promise<Request | undefined> {
    const result = await findRequestByIndex(this.user.id, index);
    if (!result) return;
    return buildRequest(this.context, result);
  }

  public async searchRequests(props: SearchRequestsProps): Promise<Request[]> {
    const results = await searchRequests({
      status: props.status,
      userId: this.user.id,
      order: props.order,
      start: props.start,
      count: props.count
    });
    return results.map((result) => buildRequest(this.context, result));
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
