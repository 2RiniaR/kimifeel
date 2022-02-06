import { ClientUser, Request } from "../../models/structures";
import { RequestBody, RequestSpecifier } from "../../endpoints/structures";
import * as EndpointError from "../../endpoints/errors";
import { withHandleModelErrors } from "../errors";
import { UserService } from "./user";

export class RequestService {
  public toBody(request: Request): RequestBody {
    const userService = new UserService();
    return {
      index: request.index,
      content: request.profile.content,
      requester: userService.toBody(request.profile.author),
      target: userService.toBody(request.profile.owner)
    };
  }

  public async find(client: ClientUser, specifier: RequestSpecifier): Promise<Request> {
    const request = await withHandleModelErrors(() => client.requests.find(specifier));
    if (!request) throw new EndpointError.RequestNotFoundError(specifier);
    return request;
  }
}
