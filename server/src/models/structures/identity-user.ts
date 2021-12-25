import { Context } from "../context";
import { ContextModel } from "../context-model";
import { UserService } from "../services";
import { Profile } from "./profile";
import { Request } from "./request";
import { ImaginaryRequest } from "./imaginary-request";
import { ForbiddenError } from "../errors";

export class IdentityUser extends ContextModel implements UserIdentifier {
  private readonly service = new UserService(this);
  public readonly id: string;
  public readonly discordId: string;

  public constructor(ctx: Context, props: UserIdentifier) {
    super(ctx);
    this.id = props.id;
    this.discordId = props.discordId;
  }

  public async getProfileByIndex(index: number): Promise<Profile | undefined> {
    return await this.service.findProfileByIndex(index);
  }

  public async getRequestByIndex(index: number): Promise<Request | undefined> {
    return await this.service.findRequestByIndex(index);
  }

  public async searchRequests(props: SearchRequestsProps): Promise<Request[]> {
    return await this.service.searchRequests(props);
  }

  public async submitRequest(content: string): Promise<Request> {
    if (this.context.clientUser.id === this.id) {
      throw new ForbiddenError();
    }

    const request = new ImaginaryRequest(this.context, {
      content,
      applicant: this.context.clientUser.asUser(),
      target: this
    });
    return await request.create();
  }
}

export type UserIdentifier = {
  id: string;
  discordId: string;
};

export type SearchRequestsProps = {
  status: "sent" | "received";
  order: "latest" | "oldest";
  start: number;
  count: number;
  content?: string;
  target?: IdentityUser;
  applicant?: IdentityUser;
};
