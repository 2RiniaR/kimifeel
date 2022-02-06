import { Context, ContextModel } from "../context";
import { ImaginaryProfile } from "./imaginary-profile";
import { withHandleRepositoryErrors } from "../errors";
import { User } from "./user";
import { RequestRepository } from "../../../prisma";
import { Request } from "./request";

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
  target: User;
  applicant: User;
  content: string;
};

class ImaginaryRequestService extends ContextModel {
  private readonly request: ImaginaryRequest;

  public constructor(request: ImaginaryRequest) {
    super(request.context);
    this.request = request;
  }

  public async create() {
    const result = await withHandleRepositoryErrors(() =>
      new RequestRepository().create({
        targetUserId: this.request.profile.owner.id,
        applicantUserId: this.request.profile.author.id,
        content: this.request.profile.content
      })
    );
    return Request.fromRaw(this.context, result);
  }
}
