import { IdentityRequest, ImaginaryRequest, Request } from "../structures";
import { buildRequest } from "../builders/request";
import { ContextModel } from "../context-model";
import { createRequest, deleteRequest } from "../../prisma";
import { NotFoundError } from "../errors";

export class RequestService extends ContextModel {
  private readonly request: IdentityRequest;

  public constructor(request: IdentityRequest) {
    super(request.context);
    this.request = request;
  }

  public async delete(): Promise<Request> {
    const result = await deleteRequest(this.request.target.id, this.request.index);
    if (!result) {
      throw new NotFoundError();
    }
    return buildRequest(this.context, result);
  }
}

export class ImaginaryRequestService extends ContextModel {
  private readonly request: ImaginaryRequest;

  public constructor(request: ImaginaryRequest) {
    super(request.context);
    this.request = request;
  }

  public async create() {
    const result = await createRequest({
      targetUserId: this.request.profile.owner.id,
      applicantUserId: this.request.profile.author.id,
      content: this.request.profile.content
    });
    return buildRequest(this.context, result);
  }
}
