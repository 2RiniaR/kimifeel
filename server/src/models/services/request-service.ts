import { IdentityRequest, ImaginaryRequest } from "../structures";
import { buildRequest } from "../builders/request";
import { ContextModel } from "../context-model";
import { createRequest, deleteRequest } from "../queries/request";

export class RequestService extends ContextModel {
  private readonly request: IdentityRequest;

  public constructor(request: IdentityRequest) {
    super(request.context);
    this.request = request;
  }

  public async delete() {
    await deleteRequest(this.request.target.id, this.request.id);
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
      userId: this.request.profile.user.id,
      requesterUserId: this.request.profile.author.id,
      content: this.request.profile.content
    });
    return buildRequest(this.context, result);
  }
}
