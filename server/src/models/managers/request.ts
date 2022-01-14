import { Request } from "../structures";
import { ContextModel } from "../context-model";
import * as db from "../../prisma";
import { DataAccessFailedError } from "../errors";
import { buildRequest } from "../builders/request";

export class RequestManager extends ContextModel {
  private readonly service = new RequestManagerService(this.context);

  public async findByIndex(index: number): Promise<Request | undefined> {
    return await this.service.findByIndex(index);
  }
}

export class RequestManagerService extends ContextModel {
  public async findByIndex(index: number): Promise<Request | undefined> {
    let result;
    try {
      result = await db.findRequestByIndex(index);
    } catch (error) {
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    if (!result) return;
    return buildRequest(this.context, result);
  }
}
