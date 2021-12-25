import { IdentityUser, ImaginaryUser, Profile, Request, SearchRequestsProps } from "../structures";
import { ContextModel } from "../context-model";
import { buildProfile } from "../builders/profile";
import { buildClientUser } from "../builders/client-user";
import { buildRequest } from "../builders/request";
import { createUser, findProfileByIndex, findRequestByIndex, searchRequests } from "../../prisma";

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
      order: props.order,
      start: props.start,
      count: props.count,
      applicantUserId: props.status === "sent" ? this.user.id : props.applicant?.id,
      targetUserId: props.status === "received" ? this.user.id : props.target?.id,
      content: props.content
    });
    return results.map((result) => buildRequest(this.context, result));
  }
}

export class ImaginaryUserService {
  private readonly user: ImaginaryUser;

  public constructor(user: ImaginaryUser) {
    this.user = user;
  }

  public async create() {
    const result = await createUser({ discordId: this.user.discordId });
    return buildClientUser(result);
  }
}
