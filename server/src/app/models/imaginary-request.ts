import { RequestRepository } from "data-store";
import { Context, ContextModel } from "./context";
import { ImaginaryProfile } from "./imaginary-profile";
import { withConvertRepositoryErrors } from "./errors";
import { User } from "./user";
import { Request } from "./request";

export type CreateRequestProps = {
  readonly target: User;
  readonly applicant: User;
  readonly content: string;
};

export class ImaginaryRequest implements ContextModel {
  private readonly service = new ImaginaryRequestService(this);
  public readonly context: Context;

  public readonly profile: ImaginaryProfile;

  constructor(ctx: Context, props: CreateRequestProps) {
    this.context = ctx;
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

class ImaginaryRequestService implements ContextModel {
  public readonly context: Context;
  private readonly request: ImaginaryRequest;

  public constructor(request: ImaginaryRequest) {
    this.context = request.context;
    this.request = request;
  }

  public async create() {
    const result = await withConvertRepositoryErrors.invoke(() =>
      new RequestRepository().create({
        targetUserId: this.request.profile.owner.id,
        applicantUserId: this.request.profile.author.id,
        content: this.request.profile.content
      })
    );
    return Request.fromRaw(this.context, result);
  }
}
