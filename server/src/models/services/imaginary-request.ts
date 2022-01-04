import { ContextModel } from "../context-model";
import { ImaginaryRequest } from "../structures";
import * as db from "../../prisma";
import { buildRequest } from "../builders/request";

export class ImaginaryRequestService extends ContextModel {
  private readonly request: ImaginaryRequest;

  public constructor(request: ImaginaryRequest) {
    super(request.context);
    this.request = request;
  }

  public async create() {
    const result = await db.createRequest({
      targetUserId: this.request.profile.owner.id,
      applicantUserId: this.request.profile.author.id,
      content: this.request.profile.content
    });
    return buildRequest(this.context, result);
  }
}
