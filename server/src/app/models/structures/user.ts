import { Context, ContextModel } from "../context";
import { Request } from "./request";
import {
  ForbiddenError,
  InvalidParameterError,
  NotFoundError,
  SubmitRequestOwnError,
  withHandleRepositoryErrors
} from "../errors";
import { ImaginaryRequest } from "./imaginary-request";
import { Profile } from "./profile";
import { ImaginaryProfile } from "./imaginary-profile";
import { RawUser, UserRepository, RequestRepository, ProfileRepository } from "../../../prisma";

export class IdentityUser extends ContextModel implements UserIdentifier {
  public readonly id: string;
  public readonly discordId: string;

  public constructor(ctx: Context, props: UserIdentifier) {
    super(ctx);
    this.id = props.id;
    this.discordId = props.discordId;
  }
}

export type UserIdentifier = {
  id: string;
  discordId: string;
};

export class User extends IdentityUser {
  private readonly service = new UserService(this);
  readonly enableMention: boolean;

  public constructor(ctx: Context, props: UserIdentifier & UserProps) {
    super(ctx, props);
    this.enableMention = props.enableMention;
  }

  public async searchRequests(props: SearchRequestsProps): Promise<Request[]> {
    if (props.start < 0) throw new InvalidParameterError<SearchRequestsProps>("start", "larger than 0");
    if (props.count < 0) throw new InvalidParameterError<SearchRequestsProps>("count", "larger than 0");

    if (this.context.clientUser.id !== this.id) {
      throw new ForbiddenError();
    }
    return await this.service.searchRequests(props);
  }

  public async submitRequest(content: string): Promise<Request> {
    if (this.context.clientUser.id === this.id) {
      throw new SubmitRequestOwnError();
    }

    const request = new ImaginaryRequest(this.context, {
      content,
      applicant: this.context.clientUser.asUser(),
      target: this
    });
    return await request.create();
  }

  public async createProfile(content: string): Promise<Profile> {
    if (this.context.clientUser.id !== this.id) {
      throw new ForbiddenError();
    }
    const profile = new ImaginaryProfile(this.context, {
      owner: this,
      author: this,
      content
    });
    return await profile.create();
  }

  public async updateConfig(props: Partial<ConfigProps>): Promise<User> {
    if (this.context.clientUser.id !== this.id) {
      throw new ForbiddenError();
    }
    return await this.service.updateConfig(props);
  }

  public async getStats(): Promise<UserStats> {
    return await this.service.getStats();
  }

  public static fromRaw(context: Context, result: RawUser): User {
    return new User(context, {
      id: result.id,
      discordId: result.discordId,
      enableMention: result.enableMention
    });
  }
}

export type SearchRequestsProps = {
  status: "sent" | "received";
  order: "latest" | "oldest";
  start: number;
  count: number;
  content?: string;
  target?: IdentityUser;
  applicant?: IdentityUser;
};

export type UserProps = ConfigProps;

export type ConfigProps = {
  enableMention: boolean;
};

export type UserStats = {
  ownedProfileCount: number;
  writtenProfileCount: number;
  selfProfileCount: number;
};

class UserService extends ContextModel {
  private readonly user: User;

  public constructor(user: User) {
    super(user.context);
    this.user = user;
  }

  public async searchRequests(props: SearchRequestsProps): Promise<Request[]> {
    let applicantUserId: string | undefined;
    let targetUserId: string | undefined;

    if (props.status === "sent") {
      const isApplicantContradicted = props.applicant && props.applicant.id !== this.user.id;
      applicantUserId = isApplicantContradicted ? "" : this.user.id;

      targetUserId = props.target?.id;
    } else {
      const isTargetContradicted = props.target && props.target.id !== this.user.id;
      targetUserId = isTargetContradicted ? "" : this.user.id;

      applicantUserId = props.applicant?.id;
    }

    const results = await withHandleRepositoryErrors(() =>
      new RequestRepository().search({
        order: props.order,
        start: props.start,
        count: props.count,
        applicantUserId,
        targetUserId,
        content: props.content
      })
    );
    return results.map((result) => Request.fromRaw(this.context, result));
  }

  public async updateConfig(props: Partial<ConfigProps>): Promise<User> {
    const user = await withHandleRepositoryErrors(() => new UserRepository().update(this.user.id, props));
    if (!user) throw new NotFoundError();
    return User.fromRaw(this.context, user);
  }

  public async getStats(): Promise<UserStats> {
    const selfId = this.user.id;
    const profileRepository = new ProfileRepository();
    return await withHandleRepositoryErrors(async () => ({
      ownedProfileCount: await profileRepository.count({ ownerUserId: selfId }),
      writtenProfileCount: await profileRepository.count({ authorUserId: selfId }),
      selfProfileCount: await profileRepository.count({ ownerUserId: selfId, authorUserId: selfId })
    }));
  }
}