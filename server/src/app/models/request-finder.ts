import { RequestRepository, RequestUniqueField } from "data-store";
import { Request } from "./request";
import { Context, ContextModel } from "./context";
import { withConvertRepositoryErrors } from "./errors";

export class RequestFinder implements ContextModel {
  private readonly service: RequestFinderService;
  public readonly context: Context;

  public constructor(context: Context) {
    this.context = context;
    this.service = new RequestFinderService(this.context);
  }

  public async find(unique: RequestUniqueField): Promise<Request | undefined> {
    return await this.service.find(unique);
  }
}

export class RequestFinderService implements ContextModel {
  public readonly context: Context;

  public constructor(context: Context) {
    this.context = context;
  }

  public async find(unique: RequestUniqueField): Promise<Request | undefined> {
    const result = await withConvertRepositoryErrors.invoke(() => new RequestRepository().find(unique));
    if (!result) return;
    return Request.fromRaw(this.context, result);
  }
}
