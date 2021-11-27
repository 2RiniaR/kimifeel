import { Request } from "../structures/request";
import { ContextModel } from "../context";

export class RequestService extends ContextModel {
  public async getByIndex(index: number): Promise<Request | null> {
    return this.repositories.requests.getByIndex(index);
  }
}
