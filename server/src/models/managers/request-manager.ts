import { getRequestById } from "../queries/request";
import { IdentityRequest, Request } from "../structures";
import { buildRequest } from "../builders/request";
import { ContextModel } from "../context-model";

export class RequestManager extends ContextModel {
  public async fetch(request: IdentityRequest): Promise<Request> {
    const result = await getRequestById(request.target.id, request.id);
    if (!result) {
      throw Error("Tried to fetch data, but it wasn't found.");
    }
    return buildRequest(this.context, result);
  }
}
