import { Context } from "../context";
import { IdentityUser } from "./identity-user";
import { IdentityRequest, RequestIdentifier } from "./identity-request";
import { ImaginaryProfile } from "./imaginary-profile";
import { ForbiddenError } from "../errors";

export class Request extends IdentityRequest {
  public readonly profile: ImaginaryProfile;
  public readonly index: number;

  public constructor(ctx: Context, props: RequestIdentifier & RequestProps) {
    super(ctx, props);
    this.profile = new ImaginaryProfile(ctx, {
      author: props.requester,
      user: props.target,
      content: props.content
    });
    this.index = props.index;
  }

  public async accept() {
    if (this.context.clientUser.id !== this.target.id) {
      throw new ForbiddenError("Can not accept the request because you are not the reviewer.");
    }
    await this.delete();
    return await this.profile.create();
  }

  public async deny() {
    if (this.context.clientUser.id !== this.target.id) {
      throw new ForbiddenError("Can not deny the request because you are not the reviewer.");
    }
    await this.delete();
  }

  public async cancel() {
    if (this.context.clientUser.id !== this.profile.author.id) {
      throw new ForbiddenError("Can not cancel the request because you are not the requester.");
    }
    await this.delete();
  }
}

export type RequestProps = {
  content: string;
  requester: IdentityUser;
  index: number;
};
