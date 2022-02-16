import { ClientUser, Request } from "app/models";
import * as Endpoint from "app/endpoints";
import { withConvertModelErrors } from "../errors";
import { UserService } from "./user";

export class RequestService {
  public toBody(request: Request): Endpoint.RequestBody {
    const userService = new UserService();
    return {
      index: request.index,
      content: request.profile.content,
      applicant: userService.toBody(request.profile.author),
      target: userService.toBody(request.profile.owner)
    };
  }

  public async find(client: ClientUser, specifier: Endpoint.RequestSpecifier): Promise<Request> {
    const request = await withConvertModelErrors.invokeAsync(() => {
      if (specifier.id !== undefined) {
        return client.requests.find({ id: specifier.id });
      } else if (specifier.index !== undefined) {
        return client.requests.find({ index: specifier.index });
      } else {
        throw new Endpoint.ParameterStructureInvalidError();
      }
    });
    if (request === undefined) throw new Endpoint.RequestNotFoundError(specifier);
    return request;
  }
}
