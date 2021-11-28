import { Request } from "../structures/request";
import { ContextModel } from "../context";
import { buildRequest } from "~/models/repositories/builders/request";
import { getRequestByIndex } from "~/models/repositories/queries/request";

export class RequestManager extends ContextModel {
  public async getByIndex(index: number): Promise<Request | undefined> {
    const result = await getRequestByIndex(this.context.clientUser.id, index);
    if (!result) return;
    return buildRequest(this.context, result);
  }
}
