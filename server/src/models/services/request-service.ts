import { ContextModel } from "../context/context-model";
import { Request } from "../structures/request";

export class RequestService extends ContextModel {
  public async getByIndex(index: number): Promise<Request | null> {
    return this.repositories.requests.getByIndex(index);
  }
}
