import { Context } from "../context";
import { ContextModel } from "../context-model";
import { UserService } from "../services";
import { Profile } from "./profile";
import { Request } from "./request";

export class IdentityUser extends ContextModel implements UserIdentifier {
  private readonly service = new UserService(this);
  public readonly id: string;

  public constructor(ctx: Context, props: UserIdentifier) {
    super(ctx);
    this.id = props.id;
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
}

export type UserIdentifier = {
  id: string;
};

export type SearchRequestsProps = {
  status: "sent" | "received";
  order: "latest" | "oldest";
  start: number;
  count: number;
};
