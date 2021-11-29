import { createRequest, deleteRequest } from "~/models/repositories/queries/request";
import { ContextModel } from "~/models/context";
import { IdentityRequest, ImaginaryRequest } from "~/models/structures/request";
import { buildRequest } from "~/models/repositories/builders/request";

export class RequestService extends ContextModel {
  private readonly request: IdentityRequest;

  public constructor(request: IdentityRequest) {
    super(request.context);
    this.request = request;
  }

  public async delete() {
    await deleteRequest(this.context.clientUser.id, this.request.id);
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
      userId: this.request.user.id,
      requesterUserId: this.request.requester.id,
      content: this.request.content
    });
    return buildRequest(this.context, result);
  }
}
