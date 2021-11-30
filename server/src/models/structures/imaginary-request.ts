import { Context } from "../context";
import { IdentityUser } from "./identity-user";
import { ContextModel } from "../context-model";
import { ImaginaryRequestService } from "../services/request-service";
import { ImaginaryProfile } from "./imaginary-profile";

export class ImaginaryRequest extends ContextModel {
  private readonly service = new ImaginaryRequestService(this);
  public readonly profile: ImaginaryProfile;

  constructor(ctx: Context, props: CreateRequestProps) {
    super(ctx);
    this.profile = new ImaginaryProfile(ctx, {
      author: props.requester,
      user: props.user,
      content: props.content
    });
  }

  public async create() {
    return await this.service.create();
  }
}

export type CreateRequestProps = {
  user: IdentityUser;
  requester: IdentityUser;
  content: string;
};
