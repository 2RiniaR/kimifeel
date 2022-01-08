import { Request } from "../structures";
import { buildRequest } from "../builders/request";
import { ContextModel } from "../context-model";
import { NotFoundError } from "../errors";
import * as db from "../../prisma";

export class RequestService extends ContextModel {
  private readonly request: Request;

  public constructor(request: Request) {
    super(request.context);
    this.request = request;
  }

  public async delete(): Promise<Request> {
    const result = await db.deleteRequestByIndex(this.request.index);
    if (!result) {
      throw new NotFoundError();
    }
    return buildRequest(this.context, result);
  }
}
