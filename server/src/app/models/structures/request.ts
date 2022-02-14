import { RawRequest, RequestRepository } from "data-store";
import { Context, ContextModel } from "../context";
import { ImaginaryProfile } from "./imaginary-profile";
import { ForbiddenError, NotFoundError, withConvertRepositoryErrors } from "../errors";
import { Profile } from "./profile";
import { User } from "./user";

export type RequestIdentifier = {
  readonly id: string;
  readonly index: number;
};

export type RequestProps = {
  readonly content: string;
  readonly target: User;
  readonly applicant: User;
};

export class IdentityRequest extends ContextModel {
  public readonly id: string;
  public readonly index: number;

  public constructor(ctx: Context, props: RequestIdentifier) {
    super(ctx);
    this.id = props.id;
    this.index = props.index;
  }
}

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

  public static fromRaw(context: Context, result: RawRequest): Request {
    return new Request(context, {
      id: result.id,
      target: new User(context, {
        id: result.targetUser.id,
        discordId: result.targetUser.discordId,
        enableMention: result.targetUser.enableMention
      }),
      content: result.content,
      index: result.index,
      applicant: new User(context, {
        id: result.applicantUser.id,
        discordId: result.applicantUser.discordId,
        enableMention: result.applicantUser.enableMention
      })
    });
  }
}

class RequestService extends ContextModel {
  private readonly request: Request;

  public constructor(request: Request) {
    super(request.context);
    this.request = request;
  }

  public async delete(): Promise<Request> {
    const result = await withConvertRepositoryErrors.invoke(() =>
      new RequestRepository().delete({ id: this.request.id })
    );
    if (!result) throw new NotFoundError();
    return Request.fromRaw(this.context, result);
  }
}
