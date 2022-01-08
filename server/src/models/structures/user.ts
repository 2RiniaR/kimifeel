import { IdentityUser, UserIdentifier } from "./identity-user";
import { Context } from "../context";
import { Request } from "./request";
import { ForbiddenError } from "../errors";
import { ImaginaryRequest } from "./imaginary-request";
import { UserService } from "../services";

export class SubmitRequestOwnError extends Error {}

export class User extends IdentityUser {
  private readonly service = new UserService(this);

  public constructor(ctx: Context, props: UserIdentifier & UserProps) {
    super(ctx, props);
  }

  public async searchRequests(props: SearchRequestsProps): Promise<Request[]> {
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
