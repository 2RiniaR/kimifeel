import { IdentityRequest, Request } from "../structures";
import { buildRequest } from "../builders/request";
import { ContextModel } from "../context-model";
import { findRequestByIndex } from "../../prisma";

export class RequestManager extends ContextModel {
  public async fetch(request: IdentityRequest): Promise<Request> {
    const result = await findRequestByIndex(request.target.id, request.index);
    if (!result) {
      throw Error("Tried to fetch data, but it wasn't found.");
    }
    return buildRequest(this.context, result);
  }
}
