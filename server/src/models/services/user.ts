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

    const results = await db.searchRequests({
      order: props.order,
      start: props.start,
      count: props.count,
      applicantUserId,
      targetUserId,
      content: props.content
    });
    return results.map((result) => buildRequest(this.context, result));
  }
}
