import { ClientUser, ClientUserFinder } from "app/models";
import * as Endpoint from "app/endpoints";
import { withConvertModelErrors } from "../errors";

export class ClientUserService {
  public async getById(id: string): Promise<ClientUser> {
    const client = await withConvertModelErrors.invokeAsync(() => new ClientUserFinder().find(id));
    if (client === undefined) throw new Endpoint.ClientUserNotExistError();
    return client;
  }
}
