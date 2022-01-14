import { Context } from "../context";
import { ImaginaryProfile } from "./imaginary-profile";
import { DataAccessFailedError, ForbiddenError, NotFoundError } from "../errors";
import { Profile } from "./profile";
import * as db from "../../prisma";
import { ContextModel } from "../context-model";
import { buildRequest } from "../builders/request";
import { IdentityUser } from "./user";

export class IdentityRequest extends ContextModel {
  public readonly id: string;
  public readonly index: number;

  public constructor(ctx: Context, props: RequestIdentifier) {
    super(ctx);
    this.id = props.id;
    this.index = props.index;
  }
}

export type RequestIdentifier = {
  id: string;
  index: number;
};

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

class RequestService extends ContextModel {
  private readonly request: Request;

  public constructor(request: Request) {
    super(request.context);
    this.request = request;
  }

  public async delete(): Promise<Request> {
    let result;
    try {
      result = await db.deleteRequestByIndex(this.request.index);
    } catch (error) {
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    if (!result) {
      throw new NotFoundError();
    }
    return buildRequest(this.context, result);
  }
}
