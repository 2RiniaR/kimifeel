import { Request } from "../structures";
import { ContextModel } from "../context";
import { withHandleRepositoryErrors } from "../errors";
import { RequestRepository, RequestUniqueField } from "../../../prisma";

export class RequestManager extends ContextModel {
  private readonly service = new RequestManagerService(this.context);

  public async find(unique: RequestUniqueField): Promise<Request | undefined> {
    return await this.service.find(unique);
  }
}

export class RequestManagerService extends ContextModel {
  public async find(unique: RequestUniqueField): Promise<Request | undefined> {
    const result = await withHandleRepositoryErrors(() => new RequestRepository().find(unique));
    if (!result) return;
    return Request.fromRaw(this.context, result);
  }
}
