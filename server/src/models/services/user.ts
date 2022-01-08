import { User, Request, SearchRequestsProps } from "../structures";
import { ContextModel } from "../context-model";
import { buildRequest } from "../builders/request";
import * as db from "../../prisma";

export class UserService extends ContextModel {
  private readonly user: User;

  public constructor(user: User) {
    super(user.context);
    this.user = user;
  }

  public async searchRequests(props: SearchRequestsProps): Promise<Request[]> {
    const results = await db.searchRequests({
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
