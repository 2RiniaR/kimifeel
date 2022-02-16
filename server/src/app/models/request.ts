import { RawRequest, RequestRepository } from "data-store";
import { Context, ContextModel } from "./context";
import { ImaginaryProfile } from "./imaginary-profile";
import { ForbiddenError, NotFoundError, withConvertRepositoryErrors } from "./errors";
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

export class Request implements ContextModel {
  private readonly service = new RequestService(this);

  public readonly id: string;
  public readonly index: number;
  public readonly profile: ImaginaryProfile;

  public constructor(public readonly context: Context, props: RequestIdentifier & RequestProps) {
    this.id = props.id;
    this.index = props.index;
    this.profile = new ImaginaryProfile(context, {
      author: props.applicant,
      owner: props.target,
      content: props.content
    });
  }

  public async accept(): Promise<Profile> {
    if (this.context.clientUser.id !== this.profile.owner.id) throw new ForbiddenError();
    await this.service.delete();
    return await this.profile.create();
  }

  public async deny(): Promise<Request> {
    if (this.context.clientUser.id !== this.profile.owner.id) throw new ForbiddenError();
    return await this.service.delete();
  }

  public async cancel(): Promise<Request> {
    if (this.context.clientUser.id !== this.profile.author.id) throw new ForbiddenError();
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

class RequestService implements ContextModel {
  public readonly context: Context;

  public constructor(private readonly request: Request) {
    this.context = request.context;
  }

  public async delete(): Promise<Request> {
    const result = await withConvertRepositoryErrors.invokeAsync(() =>
      new RequestRepository().delete({ id: this.request.id })
    );
    if (result === undefined) throw new NotFoundError();
    return Request.fromRaw(this.context, result);
  }
}
