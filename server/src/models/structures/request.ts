import { Context } from "../context";
import { IdentityUser } from "./identity-user";
import { IdentityRequest, RequestIdentifier } from "./identity-request";
import { ImaginaryProfile } from "./imaginary-profile";
import { ForbiddenError } from "../errors";
import { RequestService } from "../services";
import { Profile } from "./profile";

export class Request extends IdentityRequest {
  private readonly service = new RequestService(this);
  public readonly profile: ImaginaryProfile;

  public constructor(ctx: Context, props: RequestIdentifier & RequestProps) {
    super(ctx, props);
    this.profile = new ImaginaryProfile(ctx, {
      author: props.applicant,
      owner: props.target,
      content: props.content
    });
  }

  public async accept(): Promise<Profile> {
    if (this.context.clientUser.id !== this.profile.owner.id) {
      throw new ForbiddenError("Can not accept the requests because you are not the reviewer.");
    }
    await this.service.delete();
    return await this.profile.create();
  }

  public async deny(): Promise<Request> {
    if (this.context.clientUser.id !== this.profile.owner.id) {
      throw new ForbiddenError("Can not deny the requests because you are not the reviewer.");
    }
    return await this.service.delete();
  }

  public async cancel(): Promise<Request> {
    if (this.context.clientUser.id !== this.profile.author.id) {
      throw new ForbiddenError("Can not cancel the requests because you are not the requester.");
    }
    return await this.service.delete();
  }
}

export type RequestProps = {
  content: string;
  target: IdentityUser;
  applicant: IdentityUser;
};
