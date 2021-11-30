import { getRequestById, getRequestByIndex } from "../queries/request";
import { IdentityRequest, Request } from "../structures";
import { buildRequest } from "../builders/request";
import { ContextModel } from "../context-model";

export class RequestManager extends ContextModel {
  public async getByIndex(index: number): Promise<Request | undefined> {
    const result = await getRequestByIndex(this.context.clientUser.id, index);
    if (!result) return;
    return buildRequest(this.context, result);
  }

  public async fetch(request: IdentityRequest): Promise<Request> {
    const result = await getRequestById(request.target.id, request.id);
    if (!result) {
      throw Error("Tried to fetch data, but it wasn't found.");
    }
    return buildRequest(this.context, result);
  }
}
