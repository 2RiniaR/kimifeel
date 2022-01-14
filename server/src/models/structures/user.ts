import { Context } from "../context";
import { Request } from "./request";
import { DataAccessFailedError, ForbiddenError, InvalidParameterError, SubmitRequestOwnError } from "../errors";
import { ImaginaryRequest } from "./imaginary-request";
import * as db from "../../prisma";
import { ContextModel } from "../context-model";
import { buildRequest } from "../builders/request";

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

  public constructor(ctx: Context, props: UserIdentifier & UserProps) {
    super(ctx, props);
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

export type UserProps = {
  /* nothing */
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

    let results;
    try {
      results = await db.searchRequests({
        order: props.order,
        start: props.start,
        count: props.count,
        applicantUserId,
        targetUserId,
        content: props.content
      });
    } catch (error) {
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    return results.map((result) => buildRequest(this.context, result));
  }
}
