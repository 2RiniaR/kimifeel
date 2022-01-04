import { IdentityRequest, Request } from "../structures";
import { buildRequest } from "../builders/request";
import { ContextModel } from "../context-model";
import { NotFoundError } from "../errors";
import * as db from "prisma";

export class RequestManager extends ContextModel {
  public async fetch(request: IdentityRequest): Promise<Request> {
    const result = await db.findRequest(request.id);
    if (!result) {
      throw new NotFoundError("Tried to fetch data, but it wasn't found.");
    }
    return buildRequest(this.context, result);
  }

  public async findByIndex(index: number): Promise<Request | undefined> {
    const result = await db.findRequestByIndex(index);
    if (!result) return;
    return buildRequest(this.context, result);
  }
}
