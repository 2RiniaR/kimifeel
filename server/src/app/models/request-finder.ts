import { RequestRepository, RequestUniqueField } from "data-store";
import { Request } from "./request";
import { Context, ContextModel } from "./context";
import { withConvertRepositoryErrors } from "./errors";

export class RequestFinder implements ContextModel {
  private readonly service: RequestFinderService;

  public constructor(public readonly context: Context) {
    this.service = new RequestFinderService(this.context);
  }

  public async find(unique: RequestUniqueField): Promise<Request | undefined> {
    const request = await this.service.find(unique);
    if (
      request === undefined ||
      (this.context.clientUser.id !== request.profile.author.id &&
        this.context.clientUser.id !== request.profile.owner.id)
    )
      return undefined;
    return request;
  }
}

export class RequestFinderService implements ContextModel {
  public constructor(public readonly context: Context) {}

  public async find(unique: RequestUniqueField): Promise<Request | undefined> {
    const result = await withConvertRepositoryErrors.invokeAsync(() => new RequestRepository().find(unique));
    if (result === undefined) return;
    return Request.fromRaw(this.context, result);
  }
}
