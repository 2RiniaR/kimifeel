import { Context } from "../context";
import { ContextModel } from "../context-model";
import { ImaginaryProfile } from "./imaginary-profile";
import * as db from "../../prisma";
import { buildRequest } from "../builders/request";
import { DataAccessFailedError } from "../errors";
import { IdentityUser } from "./user";

export class ImaginaryRequest extends ContextModel {
  private readonly service = new ImaginaryRequestService(this);
  public readonly profile: ImaginaryProfile;

  constructor(ctx: Context, props: CreateRequestProps) {
    super(ctx);
    this.profile = new ImaginaryProfile(ctx, {
      author: props.applicant,
      owner: props.target,
      content: props.content
    });
  }

  public async create() {
    return await this.service.create();
  }
}

export type CreateRequestProps = {
  target: IdentityUser;
  applicant: IdentityUser;
  content: string;
};

class ImaginaryRequestService extends ContextModel {
  private readonly request: ImaginaryRequest;

  public constructor(request: ImaginaryRequest) {
    super(request.context);
    this.request = request;
  }

  public async create() {
    let result;
    try {
      result = await db.createRequest({
        targetUserId: this.request.profile.owner.id,
        applicantUserId: this.request.profile.author.id,
        content: this.request.profile.content
      });
    } catch (error) {
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    return buildRequest(this.context, result);
  }
}
