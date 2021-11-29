import { IdentityUser } from "./user";
import { Context, ContextModel } from "../context";
import { ForbiddenError } from "~/models/errors/forbidden-error";
import { ImaginaryRequestService, RequestService } from "~/models/structures/services/request-service";
import { ImaginaryProfile } from "~/models/structures/profile";

export class IdentityRequest extends ContextModel implements RequestIdentifier {
  private readonly service = new RequestService(this);
  public readonly target: IdentityUser;
  public readonly id: string;

  public constructor(ctx: Context, props: RequestIdentifier) {
    super(ctx);
    this.target = props.target;
    this.id = props.id;
  }

  public async delete() {
    await this.service.delete();
  }
}

export class Request extends IdentityRequest implements RequestProps {
  public content: string;
  public requester: IdentityUser;
  public index: number;

  public constructor(ctx: Context, props: RequestIdentifier & RequestProps) {
    super(ctx, props);
    this.content = props.content;
    this.requester = props.requester;
    this.index = props.index;
  }

  public async accept() {
    if (this.context.clientUser.id !== this.target.id) {
      throw new ForbiddenError("Can not accept the request because you are not the reviewer.");
    }
    await this.delete();
    const profile = new ImaginaryProfile(this.context, {
      content: this.content,
      author: this.requester,
      user: this.target
    });
    return await profile.create();
  }

  public async deny() {
    if (this.context.clientUser.id !== this.target.id) {
      throw new ForbiddenError("Can not deny the request because you are not the reviewer.");
    }
    await this.delete();
  }

  public async cancel() {
    if (this.context.clientUser.id !== this.requester.id) {
      throw new ForbiddenError("Can not cancel the request because you are not the requester.");
    }
    await this.delete();
  }
}

export class ImaginaryRequest extends ContextModel implements CreateRequestProps {
  private readonly service = new ImaginaryRequestService(this);
  public readonly user: IdentityUser;
  public readonly requester: IdentityUser;
  public readonly content: string;

  constructor(ctx: Context, props: CreateRequestProps) {
    super(ctx);
    this.user = props.user;
    this.content = props.content;
    this.requester = props.requester;
    this.validation();
  }

  private validation() {
    if (this.content.length > 100) throw Error();
  }

  public async create() {
    return await this.service.create();
  }
}

export type RequestIdentifier = {
  id: string;
  target: IdentityUser;
};

export type RequestProps = {
  content: string;
  requester: IdentityUser;
  index: number;
};

export type CreateRequestProps = {
  user: IdentityUser;
  requester: IdentityUser;
  content: string;
};
